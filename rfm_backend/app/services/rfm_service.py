"""
RFM Service Module

This module contains the core logic for data preprocessing and RFM (Recency, Frequency, Monetary) calculations.
It handles data loading, cleaning, and transformation to generate RFM scores for customer segmentation.
"""

import pandas as pd
import os
import logging
from datetime import datetime
from typing import Union

# Configure logging for transparency in data processing
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# File paths for data sources
import os
from pathlib import Path

# Get the project root directory (go up from rfm_backend/app/services/ to project root)
BASE_DIR = Path(__file__).parent.parent.parent.parent
CUSTOMER_DATA_PATH = BASE_DIR / "data" / "customer_data.csv"
SALES_DATA_PATH = BASE_DIR / "data" / "sales_data.csv"

def format_recency_display(days: Union[int, float]) -> str:
    """
    Format recency days into user-friendly display text.
    
    Args:
        days: Number of days since last purchase
        
    Returns:
        Formatted string for display (e.g., "5 days ago", "2.1 years ago")
    """
    if pd.isna(days) or days < 0:
        return "Unknown"
    
    days = int(days)
    
    if days == 0:
        return "Today"
    elif days == 1:
        return "1 day ago"
    elif days < 30:
        return f"{days} days ago"
    elif days < 365:
        months = round(days / 30.44, 1)  # Average days per month
        if months == 1:
            return "1 month ago"
        return f"{months} months ago"
    else:
        years = round(days / 365.25, 1)  # Account for leap years
        if years == 1:
            return "1 year ago"
        return f"{years} years ago"

def categorize_recency(days: Union[int, float]) -> str:
    """
    Categorize recency into meaningful business segments.
    
    Args:
        days: Number of days since last purchase
        
    Returns:
        Category string for business analysis
    """
    if pd.isna(days) or days < 0:
        return "Unknown"
    
    days = int(days)
    
    if days <= 30:
        return "Recent"
    elif days <= 90:
        return "Active"
    elif days <= 180:
        return "Moderate"
    elif days <= 365:
        return "Distant"
    else:
        return "Inactive"

def calculate_customer_trends(rfm_data: pd.DataFrame, sales_df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate customer purchase trends for sparkline visualization.
    
    Args:
        rfm_data: DataFrame with RFM calculations
        sales_df: DataFrame with sales transactions
        
    Returns:
        Enhanced RFM DataFrame with trend data
    """
    logger.info("Starting trend calculation...")
    
    # Validate input data
    if sales_df.empty or rfm_data.empty:
        logger.warning("Empty input data for trend calculation")
        raise ValueError("Input data is empty")
    
    if 'date' not in sales_df.columns:
        logger.warning("Date column missing from sales data")
        raise ValueError("Date column missing from sales data")
    
    # Calculate monthly spending trends for the last 12 months
    reference_date = sales_df['date'].max()
    start_date = reference_date - pd.DateOffset(months=12)
    
    logger.info(f"Calculating trends from {start_date} to {reference_date}")
    
    # Filter sales data to last 12 months
    recent_sales = sales_df[sales_df['date'] >= start_date].copy()
    
    if recent_sales.empty:
        logger.warning("No sales data in the last 12 months")
        raise ValueError("No recent sales data available")
    
    # Create month-year period for grouping
    recent_sales['month_period'] = recent_sales['date'].dt.to_period('M')
    
    # Generate all months in the range
    all_months = pd.period_range(start=start_date.to_period('M'), 
                               end=reference_date.to_period('M'), 
                               freq='M')
    
    logger.info(f"Processing {len(all_months)} months of data for {len(rfm_data)} customers")
    
    trend_data = []
    
    for i, customer_code in enumerate(rfm_data['customer_code']):
        try:
            customer_sales = recent_sales[recent_sales['customer_code'] == customer_code]
            
            if not customer_sales.empty:
                # Group by month and sum amounts
                monthly_spend = customer_sales.groupby('month_period')['amount'].sum().astype('float64')
                
                # Create complete series with zeros for months with no purchases
                complete_series = pd.Series(0.0, index=all_months, dtype='float64')
                
                # Update with actual spend data
                for period, amount in monthly_spend.items():
                    if period in complete_series.index:
                        complete_series.loc[period] = float(amount)
                
                # Convert to list for JSON serialization
                trend_values = complete_series.tolist()
            else:
                # Customer has no sales in the period
                trend_values = [0.0] * len(all_months)
            
            # Ensure we have exactly the right number of months
            if len(trend_values) != len(all_months):
                trend_values = trend_values[:len(all_months)] + [0.0] * (len(all_months) - len(trend_values))
            
            # Calculate trend direction (comparing first half vs second half)
            if len(trend_values) >= 6:
                mid_point = len(trend_values) // 2
                first_half = sum(trend_values[:mid_point])
                second_half = sum(trend_values[mid_point:])
                
                if second_half > first_half * 1.1:  # 10% increase threshold
                    trend_direction = "up"
                elif second_half < first_half * 0.9:  # 10% decrease threshold
                    trend_direction = "down"
                else:
                    trend_direction = "stable"
            else:
                trend_direction = "stable"
            
            trend_data.append({
                'customer_code': customer_code,
                'trend_values': trend_values,
                'trend_direction': trend_direction,
                'trend_peak': max(trend_values) if trend_values else 0.0,
                'trend_avg': sum(trend_values) / len(trend_values) if trend_values else 0.0
            })
            
        except Exception as e:
            logger.warning(f"Error calculating trend for customer {customer_code}: {str(e)}")
            # Add safe fallback for this customer
            trend_data.append({
                'customer_code': customer_code,
                'trend_values': [0.0] * len(all_months),
                'trend_direction': "stable",
                'trend_peak': 0.0,
                'trend_avg': 0.0
            })
    
    # Convert to DataFrame and merge with RFM data
    trends_df = pd.DataFrame(trend_data)
    logger.info(f"Successfully calculated trends for {len(trends_df)} customers")
    
    rfm_data = rfm_data.merge(trends_df, on='customer_code', how='left')
    
    # Fill any missing trend data
    rfm_data['trend_values'] = rfm_data['trend_values'].fillna().apply(lambda x: x if isinstance(x, list) else [])
    rfm_data['trend_direction'] = rfm_data['trend_direction'].fillna("stable")
    rfm_data['trend_peak'] = rfm_data['trend_peak'].fillna(0.0)
    rfm_data['trend_avg'] = rfm_data['trend_avg'].fillna(0.0)
    
    return rfm_data

def load_data():
    """
    Load data from CSV files for RFM analysis.
    Returns cleaned and processed data ready for calculations.
    """
    try:
        # Load customer and sales data
        customer_df = pd.read_csv(CUSTOMER_DATA_PATH)
        sales_df = pd.read_csv(SALES_DATA_PATH)
        
        logger.info(f"Loaded customer data: {customer_df.shape[0]} rows, {customer_df.shape[1]} columns")
        logger.info(f"Loaded sales data: {sales_df.shape[0]} rows, {sales_df.shape[1]} columns")
        
        return customer_df, sales_df
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        raise

def preprocess_data(customer_df, sales_df):
    """
    Preprocess data to handle quality issues such as negative transactions,
    missing values, invalid postcodes, and data type consistency.
    Returns preprocessed data for RFM calculations.
    """
    try:
        # 1. Ensure Data Type Consistency
        # Convert date column to datetime
        sales_df['date'] = pd.to_datetime(sales_df['date'], errors='coerce')
        # Ensure monetary values are float
        sales_df['amount'] = sales_df['amount'].astype('float64')
        sales_df['cost'] = sales_df['cost'].astype('float64')
        sales_df['profit'] = sales_df['profit'].astype('float64')
        # Ensure customer_code is string/object for consistent merging
        customer_df['customer_code'] = customer_df['customer_code'].astype('str')
        sales_df['customer_code'] = sales_df['customer_code'].astype('str')
        logger.info("Data types enforced for critical columns.")

        # 2. Handle Invalid Postcodes
        # Replace postcode 0 with "INVALID" in both datasets using replace to avoid FutureWarning
        invalid_customer_postcodes = (customer_df['postcode'] == 0).sum()
        invalid_sales_postcodes = (sales_df['postcode'] == 0).sum()
        customer_df['postcode'] = customer_df['postcode'].replace(0, "INVALID").astype(str)
        sales_df['postcode'] = sales_df['postcode'].replace(0, "INVALID").astype(str)
        logger.info(f"Flagged {invalid_customer_postcodes} invalid postcodes in customer data.")
        logger.info(f"Flagged {invalid_sales_postcodes} invalid postcodes in sales data.")

        # 3. Handle Missing Values (log only, no imputation for non-critical fields)
        missing_branch = sales_df['branch'].isnull().sum()
        missing_delivery_suburb = sales_df['delivery_suburb'].isnull().sum()
        logger.info(f"Missing values in sales data - branch: {missing_branch}, delivery_suburb: {missing_delivery_suburb}")

        # 4. Handle Negative Transaction Values
        # Exclude transactions with negative amount from RFM calculations
        negative_transactions = (sales_df['amount'] < 0).sum()
        sales_df_cleaned = sales_df[sales_df['amount'] >= 0].copy()
        logger.info(f"Excluded {negative_transactions} negative transactions from RFM calculations.")

        # 5. Ensure Data Integrity for Linking
        # Exclude sales records with unmatched customer_code
        unmatched_sales = len(sales_df_cleaned[~sales_df_cleaned['customer_code'].isin(customer_df['customer_code'])])
        sales_df_cleaned = sales_df_cleaned[sales_df_cleaned['customer_code'].isin(customer_df['customer_code'])].copy()
        logger.info(f"Excluded {unmatched_sales} sales records with unmatched customer_code.")

        logger.info(f"Preprocessed sales data: {sales_df_cleaned.shape[0]} rows remaining after cleaning.")
        return customer_df, sales_df_cleaned
    except Exception as e:
        logger.error(f"Error in preprocessing data: {str(e)}")
        raise

def calculate_rfm_scores(customer_df, sales_df):
    """
    Calculate RFM scores based on preprocessed data.
    Uses quintiles for scoring Recency, Frequency, and Monetary values.
    Returns RFM data with scores for customer segmentation.
    """
    try:
        # Calculate reference date for Recency (most recent transaction date + 1 day)
        reference_date = sales_df['date'].max() + pd.Timedelta(days=1)
        logger.info(f"Reference date for Recency calculation: {reference_date}")

        # Group sales data by customer_code to calculate RFM metrics
        rfm_data = sales_df.groupby('customer_code').agg({
            'date': [lambda x: (x.max() - reference_date).days, lambda x: x.max()],  # Recency: days from earliest date to last purchase, Last Sale Date
            'transaction_number': 'count',                      # Frequency: count of transactions
            'amount': 'sum'                                     # Monetary: total spend
        }).reset_index()

        # Flatten multi-level column index and rename columns for clarity
        rfm_data.columns = ['customer_code', 'recency', 'last_sale_date', 'frequency', 'monetary']
        logger.info(f"Calculated raw RFM metrics for {rfm_data.shape[0]} customers.")

        # Calculate Customer average transaction spend
        rfm_data['avg_transaction_spend'] = rfm_data['monetary'] / rfm_data['frequency']
        logger.info("Calculated average transaction spend for customers.")

        # Format last_sale_date to DD-MM-YY
        rfm_data['last_sale_date'] = rfm_data['last_sale_date'].dt.strftime('%d-%m-%y')
        logger.info("Formatted last sale date to DD-MM-YY.")
        
        # Add user-friendly recency formatting
        rfm_data['recency_days'] = abs(rfm_data['recency'])  # Convert to positive days
        rfm_data['recency_formatted'] = rfm_data['recency_days'].apply(lambda x: format_recency_display(x))
        rfm_data['recency_category'] = rfm_data['recency_days'].apply(lambda x: categorize_recency(x))
        logger.info("Added user-friendly recency formatting and categorization.")
        
        # Calculate trend data for sparklines (with error handling)
        try:
            rfm_data = calculate_customer_trends(rfm_data, sales_df)
            logger.info("Calculated customer trend data for sparklines.")
        except Exception as e:
            logger.warning(f"Failed to calculate trend data, continuing without trends: {str(e)}")
            # Add empty trend data as fallback
            rfm_data['trend_values'] = [[] for _ in range(len(rfm_data))]
            rfm_data['trend_direction'] = "stable"
            rfm_data['trend_peak'] = 0
            rfm_data['trend_avg'] = 0

        # Assign RFM scores based on quintiles (1 to 5, where 5 is best for all metrics)
        try:
            _, rec_bins = pd.qcut(rfm_data['recency'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop', retbins=True)
            rfm_data['recency_score'] = pd.qcut(rfm_data['recency'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
            logger.info(f"Recency quintile cut-offs: {rec_bins}")
        except ValueError as e:
            logger.warning(f"Recency qcut failed with error: {str(e)}. Falling back to simpler binning.")
            unique_values = rfm_data['recency'].nunique()
            if unique_values < 5:
                labels = list(range(1, unique_values + 1))
                rfm_data['recency_score'] = pd.qcut(rfm_data['recency'], unique_values, labels=labels, duplicates='drop')
            else:
                rfm_data['recency_score'] = pd.qcut(rfm_data['recency'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
                
        try:
            _, freq_bins = pd.qcut(rfm_data['frequency'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop', retbins=True)
            rfm_data['frequency_score'] = pd.qcut(rfm_data['frequency'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
            logger.info(f"Frequency quintile cut-offs: {freq_bins}")
        except ValueError as e:
            logger.warning(f"Frequency qcut failed with error: {str(e)}. Falling back to simpler binning.")
            unique_values = rfm_data['frequency'].nunique()
            if unique_values < 5:
                labels = list(range(1, unique_values + 1))
                rfm_data['frequency_score'] = pd.qcut(rfm_data['frequency'], unique_values, labels=labels, duplicates='drop')
            else:
                rfm_data['frequency_score'] = pd.qcut(rfm_data['frequency'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
                
        try:
            _, mon_bins = pd.qcut(rfm_data['monetary'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop', retbins=True)
            rfm_data['monetary_score'] = pd.qcut(rfm_data['monetary'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
            logger.info(f"Monetary quintile cut-offs: {mon_bins}")
        except ValueError as e:
            logger.warning(f"Monetary qcut failed with error: {str(e)}. Falling back to simpler binning.")
            unique_values = rfm_data['monetary'].nunique()
            if unique_values < 5:
                labels = list(range(1, unique_values + 1))
                rfm_data['monetary_score'] = pd.qcut(rfm_data['monetary'], unique_values, labels=labels, duplicates='drop')
            else:
                rfm_data['monetary_score'] = pd.qcut(rfm_data['monetary'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')

        # Handle any NaN values in scores (if quintiles couldn't be calculated due to data distribution)
        # Convert categorical to numeric first to avoid categorical fill errors
        if hasattr(rfm_data['recency_score'], 'cat'):
            rfm_data['recency_score'] = rfm_data['recency_score'].astype(float)
        if hasattr(rfm_data['frequency_score'], 'cat'):
            rfm_data['frequency_score'] = rfm_data['frequency_score'].astype(float)
        if hasattr(rfm_data['monetary_score'], 'cat'):
            rfm_data['monetary_score'] = rfm_data['monetary_score'].astype(float)
            
        rfm_data['recency_score'] = rfm_data['recency_score'].fillna(3).astype(int)
        rfm_data['frequency_score'] = rfm_data['frequency_score'].fillna(3).astype(int)
        rfm_data['monetary_score'] = rfm_data['monetary_score'].fillna(3).astype(int)

        # Calculate combined RFM score (simple concatenation for segment identification)
        rfm_data['rfm_score'] = rfm_data['recency_score'].astype(str) + rfm_data['frequency_score'].astype(str) + rfm_data['monetary_score'].astype(str)
        logger.info("Assigned RFM scores based on quintiles.")

        # Define customer segments based on RFM scores with enhanced granularity
        def assign_segment(row):
            """
            Enhanced segment assignment with more granular customer categorization.
            
            Args:
                row: DataFrame row containing recency_score, frequency_score, monetary_score
                
            Returns:
                str: Customer segment name
            """
            r, f, m = row['recency_score'], row['frequency_score'], row['monetary_score']
            
            # Champions - Best customers across all dimensions
            if r == 5 and f == 5 and m == 5:
                return 'Champions'
            
            # VIP Customers - Excellent recent customers with high engagement
            elif r == 5 and f >= 4 and m >= 4:
                return 'VIP Customers'
            
            # Loyal Customers - Consistently engaged customers
            elif r >= 3 and f >= 4 and m >= 3:
                return 'Loyal Customers'
            
            # Potential Loyalists - Recent customers with decent engagement
            elif r >= 4 and f >= 2 and m >= 2 and not (f >= 4 and m >= 4):
                return 'Potential Loyalists'
            
            # Recent Customers - New customers with limited history
            elif r >= 4 and f <= 2 and m <= 2:
                return 'Recent Customers'
            
            # Promising - Moderate recency with high value but low frequency
            elif r >= 3 and f <= 2 and m >= 4:
                return 'Promising'
            
            # Customers Needing Attention - Moderate recency but low engagement
            elif r >= 3 and f <= 2 and m <= 3 and m >= 2:
                return 'Customers Needing Attention'
            
            # About to Sleep - Declining recency but were valuable
            elif r <= 3 and f <= 2 and m >= 3:
                return 'About to Sleep'
            
            # Cannot Lose Them - Previously excellent customers now inactive (check before At Risk)
            elif r <= 2 and f >= 4 and m >= 4:
                return 'Cannot Lose Them'
            
            # At Risk - High-value customers with poor recent engagement
            elif r <= 2 and f >= 3 and m >= 4:
                return 'At Risk'
            
            # Lost Customers - Very inactive but were decent customers
            elif r == 1 and f >= 2 and m >= 2:
                return 'Lost Customers'
            
            # Hibernating - Low engagement across all metrics
            elif r <= 2 and f <= 2 and m <= 2:
                return 'Hibernating'
            
            # Price Sensitive - High frequency but low value
            elif r >= 3 and f >= 4 and m <= 2:
                return 'Price Sensitive'
            
            # Bargain Hunters - Moderate engagement with lower value
            elif r >= 3 and f >= 2 and m <= 2:
                return 'Bargain Hunters'
            
            # Default for any remaining combinations
            else:
                return 'Other'
        
        rfm_data['segment'] = rfm_data.apply(assign_segment, axis=1)
        logger.info("Assigned customer segments based on RFM scores.")

        # Merge with customer data to include additional attributes if needed, selecting only required fields
        selected_columns = ['customer_code', 'customer_name', 'customer_type', 'customer_ranking', 'salesperson']
        rfm_data = rfm_data.merge(customer_df[selected_columns], on='customer_code', how='left')
        logger.info(f"Merged RFM data with selected customer attributes, final shape: {rfm_data.shape}")

        return rfm_data
    except Exception as e:
        logger.error(f"Error in calculating RFM scores: {str(e)}")
        raise

def get_rfm_data():
    """
    Main function to orchestrate data loading, preprocessing, and RFM calculation.
    Returns the final RFM dataset for API exposure.
    """
    try:
        # Step 1: Load raw data
        customer_df, sales_df = load_data()
        
        # Step 2: Preprocess data to handle quality issues
        customer_df_cleaned, sales_df_cleaned = preprocess_data(customer_df, sales_df)
        
        # Step 3: Calculate RFM scores
        rfm_data = calculate_rfm_scores(customer_df_cleaned, sales_df_cleaned)
        
        # Replace NaN values with None for JSON compatibility
        rfm_data = rfm_data.where(rfm_data.notna(), None)
        
        logger.info("RFM data processing completed successfully.")
        return rfm_data
    except Exception as e:
        logger.error(f"Error in RFM data processing pipeline: {str(e)}")
        raise
