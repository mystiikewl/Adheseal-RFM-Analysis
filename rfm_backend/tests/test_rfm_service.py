"""
Unit Tests for RFM Service

This module contains unit tests for the RFM service logic, including data loading,
preprocessing, and RFM score calculations.
"""

import pytest
import pandas as pd
import os
from datetime import datetime, timedelta
from app.services.rfm_service import load_data, preprocess_data, calculate_rfm_scores, get_rfm_data

# Mock data for testing
@pytest.fixture
def mock_customer_data(tmp_path):
    """Create mock customer data for testing."""
    data = {
        'customer_code': ['C1', 'C2', 'C3'],
        'postcode': [4000, 0, 5000]
    }
    df = pd.DataFrame(data)
    file_path = tmp_path / 'customer_data.csv'
    df.to_csv(file_path, index=False)
    return file_path

@pytest.fixture
def mock_sales_data(tmp_path):
    """Create mock sales data for testing."""
    data = {
        'customer_code': ['C1', 'C1', 'C2', 'C3'],
        'date': ['2023-01-01', '2023-02-01', '2023-01-15', '2023-03-01'],
        'transaction_number': [1, 2, 3, 4],
        'amount': [100.0, 200.0, 150.0, -50.0],
        'cost': [50.0, 100.0, 75.0, -25.0],
        'profit': [50.0, 100.0, 75.0, -25.0],
        'branch': ['Branch1', 'Branch1', 'Branch2', 'Branch3'],
        'delivery_suburb': ['Suburb1', 'Suburb1', 'Suburb2', ''],
        'postcode': [4000, 4000, 0, 5000]
    }
    df = pd.DataFrame(data)
    file_path = tmp_path / 'sales_data.csv'
    df.to_csv(file_path, index=False)
    return file_path

# Mock the file paths in rfm_service to use temporary test files
def test_load_data(monkeypatch, mock_customer_data, mock_sales_data):
    """Test data loading from CSV files."""
    monkeypatch.setattr("app.services.rfm_service.CUSTOMER_DATA_PATH", str(mock_customer_data))
    monkeypatch.setattr("app.services.rfm_service.SALES_DATA_PATH", str(mock_sales_data))
    
    customer_df, sales_df = load_data()
    
    assert len(customer_df) == 3, "Customer data should load all rows"
    assert len(sales_df) == 4, "Sales data should load all rows"
    assert 'customer_code' in customer_df.columns, "Customer data should have customer_code column"
    assert 'amount' in sales_df.columns, "Sales data should have amount column"

def test_preprocess_data(monkeypatch, mock_customer_data, mock_sales_data):
    """Test data preprocessing steps."""
    monkeypatch.setattr("app.services.rfm_service.CUSTOMER_DATA_PATH", str(mock_customer_data))
    monkeypatch.setattr("app.services.rfm_service.SALES_DATA_PATH", str(mock_sales_data))
    
    customer_df, sales_df = load_data()
    customer_df_cleaned, sales_df_cleaned = preprocess_data(customer_df, sales_df)
    
    # Test data type consistency
    assert sales_df_cleaned['date'].dtype == 'datetime64[ns]', "Date column should be datetime"
    assert sales_df_cleaned['amount'].dtype == 'float64', "Amount column should be float64"
    
    # Test handling of invalid postcodes
    assert customer_df_cleaned.loc[customer_df_cleaned['customer_code'] == 'C2', 'postcode'].iloc[0] == "INVALID", "Invalid postcode should be marked as INVALID"
    
    # Test exclusion of negative transactions
    assert len(sales_df_cleaned[sales_df_cleaned['amount'] < 0]) == 0, "Negative transactions should be excluded"
    
    # Test data integrity for linking
    assert sales_df_cleaned['customer_code'].isin(customer_df_cleaned['customer_code']).all(), "All sales records should match customer codes"

def test_calculate_rfm_scores():
    """Test RFM score calculations using mock data."""
    customer_data = {
        'customer_code': ['C1', 'C2', 'C3', 'C4', 'C5']
    }
    sales_data = {
        'customer_code': ['C1', 'C1', 'C2', 'C3', 'C4', 'C4', 'C5', 'C5', 'C5'],
        'date': [datetime.now() - timedelta(days=10), datetime.now() - timedelta(days=5), datetime.now() - timedelta(days=20), datetime.now() - timedelta(days=1), datetime.now() - timedelta(days=15), datetime.now() - timedelta(days=8), datetime.now() - timedelta(days=30), datetime.now() - timedelta(days=25), datetime.now() - timedelta(days=18)],
        'transaction_number': [1, 2, 3, 4, 5, 6, 7, 8, 9],
        'amount': [100.0, 200.0, 150.0, 50.0, 300.0, 400.0, 75.0, 125.0, 250.0]
    }
    customer_df = pd.DataFrame(customer_data)
    sales_df = pd.DataFrame(sales_data)
    
    rfm_data = calculate_rfm_scores(customer_df, sales_df)
    
    assert len(rfm_data) == 5, "RFM data should have one row per customer"
    assert 'recency_score' in rfm_data.columns, "RFM data should include recency score"
    assert 'frequency_score' in rfm_data.columns, "RFM data should include frequency score"
    assert 'monetary_score' in rfm_data.columns, "RFM data should include monetary score"
    assert 'rfm_score' in rfm_data.columns, "RFM data should include combined RFM score"
    assert rfm_data['recency_score'].between(1, 5).all(), "Recency scores should be between 1 and 5"
    assert rfm_data['frequency_score'].between(1, 5).all(), "Frequency scores should be between 1 and 5"
    assert rfm_data['monetary_score'].between(1, 5).all(), "Monetary scores should be between 1 and 5"
