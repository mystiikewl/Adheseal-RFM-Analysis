from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
import numpy as np
import pandas as pd
from ..services.rfm_service import get_rfm_data

router = APIRouter(prefix="/api", tags=["rfm"])

@router.get("/rfm-data")
async def get_rfm_data_endpoint():
    """
    Endpoint to retrieve RFM analysis data.
    Returns processed RFM scores for customer segmentation.
    """
    try:
        rfm_df = get_rfm_data() # This service function should handle NaN to None
        
        # Ensure the DataFrame is properly converted to a list of dicts with JSON-compatible types
        # Replace NaN/NaT with None again, just to be absolutely sure before dict conversion
        rfm_df_filled = rfm_df.replace({np.nan: None, pd.NaT: None})
        
        list_of_dicts = []
        for record in rfm_df_filled.to_dict(orient='records'):
            processed_record = {}
            for key, value in record.items():
                # Handle different data types appropriately
                if isinstance(value, list):
                    # Handle arrays (like trend_values)
                    processed_record[key] = value
                elif isinstance(value, (np.ndarray,)):
                    # Handle numpy arrays
                    processed_record[key] = value.tolist() if value.size > 0 else []
                elif pd.isna(value) if not isinstance(value, (list, np.ndarray)) else False:
                    processed_record[key] = None
                elif isinstance(value, (np.integer, pd.Int64Dtype)):
                    processed_record[key] = int(value)
                elif isinstance(value, (np.floating, float)):
                    processed_record[key] = float(value)
                elif isinstance(value, pd.Timestamp):
                    processed_record[key] = value.isoformat()
                else:
                    processed_record[key] = value
            list_of_dicts.append(processed_record)
            
        return jsonable_encoder(list_of_dicts)
    except Exception as e:
        # Log the full exception for better debugging
        import traceback
        print(f"Error in /rfm-data endpoint: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error retrieving RFM data: {str(e)}")

@router.get("/filters")
async def get_filters():
    """
    Endpoint to retrieve available filters for RFM analysis.
    Returns filter options for user-driven segmentation based on unique values in the dataset.
    """
    try:
        rfm_df = get_rfm_data()
        
        # Extract unique values for filter categories from the dataset
        filters = {
            "customer_type": ["All"] + sorted(rfm_df['customer_type'].dropna().unique().tolist()),
            "salesperson": ["All"] + sorted(rfm_df.get('salesperson', pd.Series([])).dropna().unique().tolist()),
            "segment": ["All"] + sorted(rfm_df['segment'].dropna().unique().tolist())
        }
        
        return filters
    except Exception as e:
        import traceback
        print(f"Error in /filters endpoint: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error retrieving filter options: {str(e)}")

@router.get("/segment-analysis")
async def get_segment_analysis():
    """
    Endpoint to retrieve comprehensive segment analysis and statistics.
    Returns segment distribution, characteristics, and actionable insights.
    """
    try:
        rfm_df = get_rfm_data()
        
        # Calculate segment statistics
        segment_stats = rfm_df.groupby('segment').agg({
            'customer_code': 'count',
            'monetary': ['sum', 'mean'],
            'frequency': 'mean',
            'recency_days': 'mean'
        }).round(2)
        
        # Flatten column names
        segment_stats.columns = ['customer_count', 'total_revenue', 'avg_revenue', 'avg_frequency', 'avg_recency_days']
        segment_stats = segment_stats.reset_index()
        
        # Calculate percentages
        total_customers = rfm_df.shape[0]
        total_revenue = rfm_df['monetary'].sum()
        
        segment_stats['customer_percentage'] = ((segment_stats['customer_count'] / total_customers) * 100).round(1)
        segment_stats['revenue_percentage'] = ((segment_stats['total_revenue'] / total_revenue) * 100).round(1)
        
        # Add segment characteristics and priorities
        segment_info = {
            'Champions': {'priority': 'High', 'risk': 'Low', 'action': 'Retain & Upsell'},
            'VIP Customers': {'priority': 'High', 'risk': 'Low', 'action': 'Nurture to Champions'},
            'Loyal Customers': {'priority': 'High', 'risk': 'Low', 'action': 'Maintain Engagement'},
            'Potential Loyalists': {'priority': 'Medium-High', 'risk': 'Medium', 'action': 'Build Relationship'},
            'Recent Customers': {'priority': 'Medium', 'risk': 'Medium', 'action': 'Onboard & Educate'},
            'Promising': {'priority': 'Medium-High', 'risk': 'Medium', 'action': 'Premium Targeting'},
            'Customers Needing Attention': {'priority': 'Medium', 'risk': 'Medium-High', 'action': 'Re-engage'},
            'About to Sleep': {'priority': 'Medium-High', 'risk': 'High', 'action': 'Win-back Campaign'},
            'At Risk': {'priority': 'High', 'risk': 'High', 'action': 'Immediate Intervention'},
            'Cannot Lose Them': {'priority': 'Critical', 'risk': 'Critical', 'action': 'Emergency Win-back'},
            'Lost Customers': {'priority': 'Low-Medium', 'risk': 'Low', 'action': 'Long-term Win-back'},
            'Hibernating': {'priority': 'Low', 'risk': 'Low', 'action': 'Low-cost Automation'},
            'Price Sensitive': {'priority': 'Medium', 'risk': 'Low', 'action': 'Volume Discounts'},
            'Bargain Hunters': {'priority': 'Low-Medium', 'risk': 'Low', 'action': 'Deal Campaigns'},
            'Other': {'priority': 'Variable', 'risk': 'Variable', 'action': 'Individual Analysis'}
        }
        
        # Add segment info to stats
        for idx, row in segment_stats.iterrows():
            segment_name = row['segment']
            if segment_name in segment_info:
                segment_stats.loc[idx, 'priority'] = segment_info[segment_name]['priority']
                segment_stats.loc[idx, 'risk_level'] = segment_info[segment_name]['risk']
                segment_stats.loc[idx, 'recommended_action'] = segment_info[segment_name]['action']
        
        # Calculate key insights
        high_priority_segments = segment_stats[segment_stats['priority'].isin(['High', 'Critical'])]
        high_risk_segments = segment_stats[segment_stats['risk_level'].isin(['High', 'Critical'])]
        
        insights = {
            'total_customers': int(total_customers),
            'total_revenue': float(total_revenue),
            'segments_count': len(segment_stats),
            'high_priority_customers': int(high_priority_segments['customer_count'].sum()),
            'high_priority_revenue': float(high_priority_segments['total_revenue'].sum()),
            'high_risk_customers': int(high_risk_segments['customer_count'].sum()),
            'top_segment': segment_stats.loc[segment_stats['customer_count'].idxmax(), 'segment'],
            'most_valuable_segment': segment_stats.loc[segment_stats['total_revenue'].idxmax(), 'segment']
        }
        
        return {
            'segment_statistics': segment_stats.to_dict('records'),
            'key_insights': insights,
            'last_updated': pd.Timestamp.now().isoformat()
        }
        
    except Exception as e:
        import traceback
        print(f"Error in /segment-analysis endpoint: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error retrieving segment analysis: {str(e)}")
