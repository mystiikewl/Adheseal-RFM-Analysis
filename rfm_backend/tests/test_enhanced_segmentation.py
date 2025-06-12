"""
Test suite for enhanced RFM segmentation logic.

This module tests the expanded customer segmentation to ensure
all segment assignments work correctly for different RFM score combinations.
"""

import pytest
import pandas as pd
from unittest.mock import patch
import sys
import os

# Add the parent directory to sys.path to import the app modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.services.rfm_service import calculate_rfm_scores


class TestEnhancedSegmentation:
    """Test class for enhanced RFM segmentation logic."""
    
    def create_test_data(self):
        """Create test data for segmentation testing."""
        # Create sample customer data
        customer_data = {
            'customer_code': [f'CUST{i:03d}' for i in range(1, 16)],
            'customer_name': [f'Customer {i}' for i in range(1, 16)],
            'customer_type': ['Regular'] * 15,
            'customer_ranking': ['A'] * 15,
            'salesperson': ['John Doe'] * 15,
            'postcode': ['12345'] * 15  # Add missing postcode column
        }
        customer_df = pd.DataFrame(customer_data)
        
        # Create sales data representing different RFM scenarios
        sales_data = []
        base_date = pd.Timestamp('2024-01-01')
        
        # Test cases for different segment combinations
        test_cases = [
            # Champions: R=5, F=5, M=5
            {'customer': 'CUST001', 'recency_days': 1, 'frequency': 25, 'monetary': 5000},
            # VIP Customers: R=5, F=4, M=4  
            {'customer': 'CUST002', 'recency_days': 2, 'frequency': 20, 'monetary': 4000},
            # Loyal Customers: R=3, F=4, M=3
            {'customer': 'CUST003', 'recency_days': 90, 'frequency': 18, 'monetary': 2500},
            # Potential Loyalists: R=4, F=2, M=2
            {'customer': 'CUST004', 'recency_days': 30, 'frequency': 8, 'monetary': 800},
            # Recent Customers: R=4, F=1, M=1
            {'customer': 'CUST005', 'recency_days': 15, 'frequency': 3, 'monetary': 300},
            # Promising: R=3, F=1, M=5
            {'customer': 'CUST006', 'recency_days': 60, 'frequency': 2, 'monetary': 6000},
            # Customers Needing Attention: R=3, F=1, M=2
            {'customer': 'CUST007', 'recency_days': 75, 'frequency': 4, 'monetary': 600},
            # About to Sleep: R=2, F=1, M=4
            {'customer': 'CUST008', 'recency_days': 200, 'frequency': 3, 'monetary': 3000},
            # At Risk: R=2, F=3, M=4
            {'customer': 'CUST009', 'recency_days': 180, 'frequency': 12, 'monetary': 3500},
            # Cannot Lose Them: R=1, F=5, M=5
            {'customer': 'CUST010', 'recency_days': 300, 'frequency': 22, 'monetary': 8000},
            # Lost Customers: R=1, F=2, M=2
            {'customer': 'CUST011', 'recency_days': 400, 'frequency': 8, 'monetary': 1200},
            # Hibernating: R=1, F=1, M=1
            {'customer': 'CUST012', 'recency_days': 500, 'frequency': 2, 'monetary': 200},
            # Price Sensitive: R=4, F=5, M=1
            {'customer': 'CUST013', 'recency_days': 20, 'frequency': 30, 'monetary': 600},
            # Bargain Hunters: R=3, F=3, M=1
            {'customer': 'CUST014', 'recency_days': 50, 'frequency': 10, 'monetary': 400},
            # Other (mixed pattern): R=2, F=2, M=3
            {'customer': 'CUST015', 'recency_days': 150, 'frequency': 6, 'monetary': 1800},
        ]
        
        # Generate sales transactions for each test case
        transaction_id = 1
        for case in test_cases:
            customer = case['customer']
            frequency = case['frequency']
            total_monetary = case['monetary']
            recency_days = case['recency_days']
            
            # Create transactions spread over time
            for i in range(frequency):
                transaction_date = base_date - pd.Timedelta(days=recency_days + (i * 30))
                amount = total_monetary / frequency  # Distribute total across transactions
                
                sales_data.append({
                    'transaction_number': f'TXN{transaction_id:06d}',
                    'customer_code': customer,
                    'date': transaction_date,
                    'amount': amount,
                    'cost': amount * 0.7,  # 70% cost ratio
                    'profit': amount * 0.3,  # 30% profit
                    'branch': 'Main',
                    'postcode': '12345',
                    'delivery_suburb': 'Test Suburb'
                })
                transaction_id += 1
        
        sales_df = pd.DataFrame(sales_data)
        return customer_df, sales_df
    
    @patch('app.services.rfm_service.load_data')
    def test_segment_assignments(self, mock_load_data):
        """Test that all segments are assigned correctly."""
        customer_df, sales_df = self.create_test_data()
        mock_load_data.return_value = (customer_df, sales_df)
        
        # Mock the paths to prevent file system access
        with patch('app.services.rfm_service.CUSTOMER_DATA_PATH', 'mock_path'), \
             patch('app.services.rfm_service.SALES_DATA_PATH', 'mock_path'):
            
            # Calculate RFM scores (this will call our enhanced segmentation)
            from app.services.rfm_service import get_rfm_data
            rfm_df = get_rfm_data()
        
        # Verify we have data for all customers
        assert len(rfm_df) == 15, f"Expected 15 customers, got {len(rfm_df)}"
        
        # Check specific segment assignments
        segment_mapping = rfm_df.set_index('customer_code')['segment'].to_dict()
        
        # Test key segment assignments (these should match our enhanced logic)
        expected_segments = {
            'CUST001': 'Champions',  # R=5, F=5, M=5
            'CUST002': 'VIP Customers',  # R=5, F≥4, M≥4
            'CUST010': 'Cannot Lose Them',  # R≤2, F≥4, M≥4
            'CUST012': 'Hibernating',  # R≤2, F≤2, M≤2
        }
        
        for customer, expected_segment in expected_segments.items():
            actual_segment = segment_mapping.get(customer)
            assert actual_segment == expected_segment, \
                f"Customer {customer}: expected '{expected_segment}', got '{actual_segment}'"
        
        # Verify we have multiple different segments
        unique_segments = rfm_df['segment'].nunique()
        assert unique_segments >= 10, \
            f"Expected at least 10 different segments, got {unique_segments}"
        
        # Verify no customers are in the old 'Customers with Potential' segment
        assert 'Customers with Potential' not in rfm_df['segment'].values, \
            "Old segment 'Customers with Potential' should not exist in enhanced segmentation"
        
        print(f"✅ Test passed! Found {unique_segments} different segments:")
        for segment in sorted(rfm_df['segment'].unique()):
            count = (rfm_df['segment'] == segment).sum()
            print(f"  - {segment}: {count} customers")
    
    def test_segment_logic_edge_cases(self):
        """Test edge cases in segment assignment logic."""
        # Test the segment assignment function directly
        from app.services.rfm_service import calculate_rfm_scores
        
        # Create minimal test data for edge cases
        customer_df = pd.DataFrame({
            'customer_code': ['TEST001', 'TEST002'],
            'customer_name': ['Test 1', 'Test 2'],
            'customer_type': ['Regular', 'Regular'],
            'customer_ranking': ['A', 'A'],
            'salesperson': ['Test', 'Test'],
            'postcode': ['12345', '12345']  # Add missing postcode column
        })
        
        sales_df = pd.DataFrame({
            'transaction_number': ['TXN001', 'TXN002'],
            'customer_code': ['TEST001', 'TEST002'],
            'date': [pd.Timestamp('2024-01-01'), pd.Timestamp('2024-01-01')],
            'amount': [1000, 2000],
            'cost': [700, 1400],
            'profit': [300, 600],
            'branch': ['Main', 'Main'],
            'postcode': ['12345', '12345'],
            'delivery_suburb': ['Test', 'Test']
        })
        
        # This should not raise any exceptions
        try:
            result_df = calculate_rfm_scores(customer_df, sales_df)
            assert len(result_df) == 2, "Should process both test customers"
            assert 'segment' in result_df.columns, "Should have segment column"
            print("✅ Edge case test passed!")
        except Exception as e:
            pytest.fail(f"Edge case test failed with error: {str(e)}")


if __name__ == "__main__":
    # Run basic tests
    test_instance = TestEnhancedSegmentation()
    test_instance.test_segment_assignments()
    test_instance.test_segment_logic_edge_cases()
    print("🎉 All enhanced segmentation tests passed!") 