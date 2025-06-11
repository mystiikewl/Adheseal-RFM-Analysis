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
                if pd.isna(value):
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
