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
        
        # Merge segment info with stats
        for i, row in segment_stats.iterrows():
            segment_name = row['segment']
            if segment_name in segment_info:
                segment_stats.loc[i, 'priority'] = segment_info[segment_name]['priority']
                segment_stats.loc[i, 'risk'] = segment_info[segment_name]['risk']
                segment_stats.loc[i, 'recommended_action'] = segment_info[segment_name]['action']
        
        return segment_stats.to_dict('records')
        
    except Exception as e:
        logger.error(f"Error in segment analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error calculating segment analysis: {str(e)}")

@router.get("/rfm-guide")
async def get_rfm_guide():
    """
    Endpoint to retrieve comprehensive RFM analysis guide and segment definitions.
    Returns educational content about RFM methodology and detailed segment information.
    """
    try:
        # Import segment guide functions
        from app.services.segment_guide import get_all_segments, get_high_priority_segments, get_segments_by_risk
        
        # Get all segment definitions
        all_segments = get_all_segments()
        
        # Convert dataclass objects to dictionaries for JSON serialization
        segments_dict = {}
        for name, segment_info in all_segments.items():
            segments_dict[name] = {
                'name': segment_info.name,
                'description': segment_info.description,
                'characteristics': segment_info.characteristics,
                'marketing_strategy': segment_info.marketing_strategy,
                'priority': segment_info.priority,
                'risk_level': segment_info.risk_level,
                'revenue_potential': segment_info.revenue_potential
            }
        
        # RFM methodology explanation
        rfm_methodology = {
            'overview': "RFM Analysis is a customer segmentation technique that uses transaction history to divide customers into meaningful groups based on three key behavioral dimensions.",
            'components': {
                'recency': {
                    'name': 'Recency (R)',
                    'description': 'How recently a customer made their last purchase',
                    'importance': 'Recent customers are more likely to respond to marketing and make repeat purchases',
                    'scoring': 'Scored 1-5, where 5 represents the most recent purchases',
                    'business_impact': 'Recent customers have higher engagement rates and conversion potential'
                },
                'frequency': {
                    'name': 'Frequency (F)', 
                    'description': 'How often a customer makes purchases over a specific time period',
                    'importance': 'Frequent buyers show strong brand loyalty and engagement',
                    'scoring': 'Scored 1-5, where 5 represents the highest purchase frequency',
                    'business_impact': 'High-frequency customers have higher lifetime value and retention rates'
                },
                'monetary': {
                    'name': 'Monetary (M)',
                    'description': 'Total amount of money a customer has spent over a specific time period',
                    'importance': 'High-value customers contribute significantly to revenue and profitability',
                    'scoring': 'Scored 1-5, where 5 represents the highest monetary value',
                    'business_impact': 'High-monetary customers are prime targets for premium products and services'
                }
            },
            'scoring_system': {
                'method': 'Quintile-based scoring where customers are divided into 5 equal groups',
                'calculation': 'Each metric (R, F, M) is scored from 1 (lowest) to 5 (highest)',
                'combination': 'RFM scores are combined to create customer segments (e.g., 5-5-5 for Champions)',
                'interpretation': 'Higher scores indicate more desirable customer behaviors'
            }
        }
        
        # Segment categories for easier navigation
        segment_categories = {
            'high_value': {
                'name': 'High-Value Customers',
                'description': 'Your most valuable customers requiring premium attention',
                'segments': ['Champions', 'VIP Customers', 'Loyal Customers'],
                'color_theme': 'green',
                'focus': 'Retention and growth'
            },
            'growth_potential': {
                'name': 'Growth Potential',
                'description': 'Customers with opportunity for increased engagement and value',
                'segments': ['Potential Loyalists', 'Recent Customers', 'Promising'],
                'color_theme': 'lime',
                'focus': 'Development and nurturing'
            },
            'attention_needed': {
                'name': 'Attention Needed',
                'description': 'Customers showing signs of declining engagement',
                'segments': ['Customers Needing Attention', 'About to Sleep'],
                'color_theme': 'yellow',
                'focus': 'Re-engagement'
            },
            'high_risk': {
                'name': 'High Risk',
                'description': 'Valuable customers at risk of churning',
                'segments': ['At Risk', 'Cannot Lose Them'],
                'color_theme': 'orange',
                'focus': 'Immediate intervention'
            },
            'lost_inactive': {
                'name': 'Lost/Inactive',
                'description': 'Customers with minimal recent engagement',
                'segments': ['Lost Customers', 'Hibernating'],
                'color_theme': 'red',
                'focus': 'Win-back or maintenance'
            },
            'price_focused': {
                'name': 'Price-Focused',
                'description': 'Customers driven primarily by deals and value',
                'segments': ['Price Sensitive', 'Bargain Hunters'],
                'color_theme': 'blue',
                'focus': 'Value-based marketing'
            },
            'uncategorized': {
                'name': 'Uncategorized',
                'description': 'Customers requiring individual analysis',
                'segments': ['Other'],
                'color_theme': 'gray',
                'focus': 'Individual assessment'
            }
        }
        
        # Implementation benefits
        implementation_benefits = [
            'More targeted marketing campaigns with higher conversion rates',
            'Better resource allocation focusing on high-value customer segments',
            'Improved customer experience through relevant messaging',
            'Enhanced revenue potential by identifying upsell and cross-sell opportunities',
            'Proactive churn prevention through early identification of at-risk customers',
            'Operational efficiency with clear action plans for each segment type',
            'Data-driven decision making based on customer behavior patterns',
            'Increased customer lifetime value through strategic engagement'
        ]
        
        # Best practices
        best_practices = [
            'Regular analysis: Update RFM scores monthly or quarterly for accurate segmentation',
            'Action-oriented: Each segment should have clear, specific marketing strategies',
            'Resource prioritization: Focus efforts on high-priority segments first',
            'Personalization: Tailor messaging and offers to segment characteristics',
            'Test and measure: Continuously evaluate campaign effectiveness by segment',
            'Cross-functional alignment: Ensure all teams understand segment definitions',
            'Historical tracking: Monitor segment migration patterns over time',
            'Integration: Combine RFM insights with other customer data for deeper understanding'
        ]
        
        return {
            'rfm_methodology': rfm_methodology,
            'segments': segments_dict,
            'segment_categories': segment_categories,
            'implementation_benefits': implementation_benefits,
            'best_practices': best_practices,
            'total_segments': len(segments_dict),
            'high_priority_segments': get_high_priority_segments(),
            'critical_risk_segments': get_segments_by_risk('Critical'),
            'high_risk_segments': get_segments_by_risk('High')
        }
        
    except Exception as e:
        logger.error(f"Error in RFM guide endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving RFM guide: {str(e)}")
