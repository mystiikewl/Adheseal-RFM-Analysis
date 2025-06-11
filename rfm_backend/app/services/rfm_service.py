"""
RFM Service Module

This module contains the core logic for data preprocessing and RFM (Recency, Frequency, Monetary) calculations.
It handles data loading, cleaning, and transformation to generate RFM scores for customer segmentation.
"""

import pandas as pd
import os
import logging
from datetime import datetime

# Configure logging for transparency in data processing
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# File paths for data sources
import os
BASE_DIR = "c:/Users/User/Documents/Projects/Adheseal RFM Analysis"
CUSTOMER_DATA_PATH = os.path.join(BASE_DIR, "data", "customer_data.csv")
SALES_DATA_PATH = os.path.join(BASE_DIR, "data", "sales_data.csv")

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
>>>>>>> REPLACE

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
            'date': lambda x: (x.max() - reference_date).days,  # Recency: days from earliest date to last purchase
            'transaction_number': 'count',                      # Frequency: count of transactions
            'amount': 'sum'                                     # Monetary: total spend
        }).reset_index()
>>>>>>> REPLACE

        # Rename columns for clarity
        rfm_data.columns = ['customer_code', 'recency', 'frequency', 'monetary']
        logger.info(f"Calculated raw RFM metrics for {rfm_data.shape[0]} customers.")

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
>>>>>>> REPLACE
                
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
>>>>>>> REPLACE

        # Handle any NaN values in scores (if quintiles couldn't be calculated due to data distribution)
        rfm_data['recency_score'] = rfm_data['recency_score'].fillna(3).astype(int)
        rfm_data['frequency_score'] = rfm_data['frequency_score'].fillna(3).astype(int)
        rfm_data['monetary_score'] = rfm_data['monetary_score'].fillna(3).astype(int)

        # Calculate combined RFM score (simple concatenation for segment identification)
        rfm_data['rfm_score'] = rfm_data['recency_score'].astype(str) + rfm_data['frequency_score'].astype(str) + rfm_data['monetary_score'].astype(str)
        logger.info("Assigned RFM scores based on quintiles.")

        # Define customer segments based on RFM scores
        def assign_segment(row):
            r, f, m = row['recency_score'], row['frequency_score'], row['monetary_score']
            if r == 5 and f >= 4 and m >= 4:
                return 'VIP Customers'
            elif r >= 4 and (f == 3 or m == 3):
                return 'Customers with Potential'
            elif r <= 2 and f >= 4 and m >= 4:
                return 'At Risk'
            elif r <= 2 and f <= 2 and m <= 2:
                return 'Hibernating'
            else:
                return 'Other'
        
        rfm_data['segment'] = rfm_data.apply(assign_segment, axis=1)
        logger.info("Assigned customer segments based on RFM scores.")
>>>>>>> REPLACE

        # Merge with customer data to include additional attributes if needed
        rfm_data = rfm_data.merge(customer_df, on='customer_code', how='left')
        logger.info(f"Merged RFM data with customer attributes, final shape: {rfm_data.shape}")

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
