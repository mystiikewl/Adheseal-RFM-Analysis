from pydantic import BaseModel
from typing import List, Optional

class RFMScore(BaseModel):
    """
    Model for individual RFM scores for a customer.
    """
    customer_code: str
    recency: int
    frequency: int
    monetary: float
    recency_score: int
    frequency_score: int
    monetary_score: int
    rfm_score: str

class RFMDataResponse(BaseModel):
    """
    Model for the response containing a list of RFM scores for multiple customers.
    """
    data: List[RFMScore]

class FilterOption(BaseModel):
    """
    Model for filter options available for RFM analysis.
    """
    name: str
    value: str

class FiltersResponse(BaseModel):
    """
    Model for the response containing available filter options.
    """
    filters: List[FilterOption]
