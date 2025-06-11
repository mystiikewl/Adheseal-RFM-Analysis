import json
import pandas as pd
import os
from datetime import datetime

def load_headers():
    """Load documented headers from data_headers.json."""
    try:
        with open('data_headers.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: data_headers.json not found. Please ensure the file exists.")
        return {}
    except json.JSONDecodeError:
        print("Error: data_headers.json is not a valid JSON file.")
        return {}

def analyze_csv(file_path, expected_headers, key_metrics=None):
    """Analyze a CSV file, verify headers, and provide summary statistics."""
    print(f"\nAnalyzing {file_path}...")
    
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found.")
        return
    
    try:
        df = pd.read_csv(file_path)
        actual_headers = list(df.columns)
        
        # Verify headers
        if actual_headers == expected_headers:
            print("Headers match the documented structure.")
        else:
            print("Warning: Headers do not match the documented structure.")
            print(f"Expected: {expected_headers}")
            print(f"Actual: {actual_headers}")
        
        # Basic statistics
        print("\nBasic Information:")
        print(f"Number of rows: {len(df)}")
        print(f"Number of columns: {len(df.columns)}")
        print("\nMissing Values:")
        print(df.isnull().sum().to_string())
        
        # Data types
        print("\nData Types:")
        print(df.dtypes.to_string())
        
        # Summary statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
        if not numeric_cols.empty:
            print("\nSummary Statistics for Numeric Columns:")
            print(df[numeric_cols].describe().to_string())
        
        # Focus on key metrics if provided
        if key_metrics:
            print("\nKey Metrics Analysis:")
            for metric, description in key_metrics.items():
                if metric in df.columns:
                    if df[metric].dtype in ['float64', 'int64']:
                        total = df[metric].sum()
                        avg = df[metric].mean()
                        print(f"{metric} ({description}):")
                        print(f"  Total: {total:.2f}")
                        print(f"  Average: {avg:.2f}")
                    else:
                        unique_vals = df[metric].nunique()
                        top_vals = df[metric].value_counts().head(5)
                        print(f"{metric} ({description}):")
                        print(f"  Unique Values: {unique_vals}")
                        print(f"  Top 5 Most Frequent Values:\n{top_vals.to_string()}")
                else:
                    print(f"Warning: Key metric '{metric}' not found in data.")
    except Exception as e:
        print(f"Error analyzing {file_path}: {str(e)}")

def main():
    """Main function to analyze data files using documented headers."""
    headers_data = load_headers()
    if not headers_data:
        return
    
    # Analyze customer_data.csv
    customer_file = 'data/customer_data.csv'
    if 'customer_data.csv' in headers_data:
        analyze_csv(customer_file, headers_data['customer_data.csv']['headers'])
    
    # Analyze sales_data.csv with focus on key metrics
    sales_file = 'data/sales_data.csv'
    if 'sales_data.csv' in headers_data:
        sales_info = headers_data['sales_data.csv']
        analyze_csv(sales_file, sales_info['headers'], sales_info.get('key_metrics', {}))

if __name__ == "__main__":
    print(f"Data Analysis Report - Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    main()
