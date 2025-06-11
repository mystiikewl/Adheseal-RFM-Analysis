"""
Integration Tests for API Endpoints

This module contains integration tests for the API endpoints of the Adheseal RFM Analysis Dashboard.
It tests the functionality of the endpoints for retrieving RFM data and filter options.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

# Create a test client for the FastAPI app
client = TestClient(app)

def test_get_rfm_data_endpoint(monkeypatch):
    """Test the /api/rfm-data endpoint to ensure it returns RFM data correctly."""
    # Mock the get_rfm_data function to return a predefined response
    def mock_get_rfm_data():
        import pandas as pd
        data = {
            'customer_code': ['C1', 'C2', 'C3'],
            'recency': [10, 20, 5],
            'frequency': [2, 1, 3],
            'monetary': [300.0, 150.0, 500.0],
            'recency_score': [4, 2, 5],
            'frequency_score': [3, 1, 5],
            'monetary_score': [3, 1, 5],
            'rfm_score': ['432', '211', '555']
        }
        return pd.DataFrame(data)
    
    monkeypatch.setattr("app.api.endpoints.get_rfm_data", mock_get_rfm_data)
    
    response = client.get("/api/rfm-data")
    
    assert response.status_code == 200, "Endpoint should return a 200 status code"
    data = response.json()
    assert len(data) == 3, "Response should contain data for 3 customers"
    assert data[0]['customer_code'] == 'C1', "First customer code should be C1"
    assert 'rfm_score' in data[0], "Response data should include RFM score"
    assert data[0]['rfm_score'] == '432', "RFM score for first customer should be 432"

def test_get_filters_endpoint():
    """Test the /api/filters endpoint to ensure it returns filter options."""
    response = client.get("/api/filters")
    
    assert response.status_code == 200, "Endpoint should return a 200 status code"
    data = response.json()
    assert 'customer_group' in data, "Response should include customer_group filter"
    assert 'customer_type' in data, "Response should include customer_type filter"
    assert 'customer_ranking' in data, "Response should include customer_ranking filter"
    assert 'state' in data, "Response should include state filter"
    assert isinstance(data['customer_group'], list), "customer_group should be a list of options"
    assert 'All' in data['customer_group'], "customer_group should include 'All' option"
