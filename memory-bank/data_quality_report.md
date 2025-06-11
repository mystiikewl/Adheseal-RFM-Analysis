# Data Quality Report: Adheseal RFM Analysis Dashboard

## Overview

This document provides a comprehensive overview of the data quality for the datasets used in the Adheseal RFM Analysis Dashboard project. It summarizes insights from the analysis performed by `data_analyzer.py` on `customer_data.csv` and `sales_data.csv`, highlighting data structure, completeness, key identifiers, and potential issues. This reference ensures consistency and informs data preprocessing steps for RFM (Recency, Frequency, Monetary) analysis.

## Data Sources

- **customer_data.csv**: Contains customer information critical for linking sales data to specific customer profiles.
  - **Rows**: 1,863
  - **Columns**: 12
- **sales_data.csv**: Contains transaction data essential for calculating RFM metrics.
  - **Rows**: 67,800
  - **Columns**: 11

## Data Quality Metrics

### Completeness (Missing Values)

- **customer_data.csv**:
  - No missing values across all 12 columns, indicating high completeness.
  - Columns: `customer_code`, `account_type`, `customer_name`, `salesperson`, `suburb`, `state`, `postcode`, `customer_group`, `customer_type`, `customer_ranking`, `email`, `phone`
- **sales_data.csv**:
  - Minor missing values observed in specific columns:
    - `branch`: 25 missing values
    - `delivery_suburb`: 11 missing values
  - All other columns have no missing data, suggesting generally good completeness for critical metrics.

### Data Types

- **customer_data.csv**:
  - Most columns are of type `object` (string), suitable for categorical data.
  - `postcode` is of type `int64`, appropriate for numerical analysis.
- **sales_data.csv**:
  - Mixed data types reflecting the nature of transaction data:
    - `transaction_number` and `postcode` are `int64` (numerical).
    - `cost`, `amount`, and `profit` are `float64` (numerical, suitable for financial calculations).
    - `date`, `branch`, `customer_code`, `delivery_suburb`, `salesperson`, and `transaction_type` are `object` (string, suitable for categorical analysis).

### Summary Statistics for Numeric Columns

- **customer_data.csv**:
  - `postcode`:
    - Mean: 4112.60
    - Std: 840.43
    - Min: 0 (potential data issue, as 0 is not a valid postcode)
    - Max: 9726
    - Quartiles: 4053 (25%), 4208 (50%), 4508 (75%)
- **sales_data.csv**:
  - `transaction_number`:
    - Mean: 282457.81
    - Std: 19583.20
    - Min: 248416
    - Max: 316378
  - `cost`:
    - Mean: 461.76
    - Std: 1401.34
    - Min: -1229.80 (negative values may indicate refunds or data issues)
    - Max: 117918.75
  - `amount`:
    - Mean: 619.63
    - Std: 1742.05
    - Min: -1422.12 (negative values may indicate refunds)
    - Max: 137156.25
  - `profit`:
    - Mean: 157.87
    - Std: 845.38
    - Min: -31292.47 (significant losses in some transactions)
    - Max: 80516.61
  - `postcode`:
    - Mean: 4223.88
    - Std: 525.42
    - Min: 0 (potential data issue)
    - Max: 9726

## Key Identifiers and Metrics

- **customer_data.csv**:

  - **Primary Identifier**: `customer_code` - Unique identifier for linking customers to sales transactions, critical for RFM analysis.
  - **Supporting Identifiers**: `customer_group`, `customer_type`, `customer_ranking` - Useful for segmenting customers beyond RFM metrics.
  - **Geographic Data**: `suburb`, `state`, `postcode` - Enable location-based analysis and segmentation.

- **sales_data.csv**:
  - **Primary Identifier**: `transaction_number` - Unique identifier for each sale, useful for tracking individual transactions.
  - **Linking Identifier**: `customer_code` - Links sales to specific customers in `customer_data.csv`, essential for RFM calculations.
  - **Key Metrics for RFM Analysis**:
    - `date`: Transaction date, critical for calculating Recency.
    - `transaction_number`: Can be used to count Frequency of purchases per customer.
    - `amount`: Total sale per transaction, used for Monetary value in RFM.
    - `profit`: Profit made on the transaction, provides additional insight into customer value.
  - **Supporting Identifiers**: `salesperson`, `branch` - Useful for analyzing sales performance by team or location.

## Notable Issues and Considerations

- **Missing Values in sales_data.csv**:
  - Small number of missing values in `branch` (25) and `delivery_suburb` (11) may require imputation or exclusion depending on analysis needs. These fields are not core to RFM calculations but could impact geographic or branch-based segmentation.
- **Negative Values in sales_data.csv**:
  - Negative values in `cost`, `amount`, and `profit` likely indicate refunds or returns. These should be handled appropriately in RFM calculations (e.g., excluding or adjusting for negative transactions) to avoid skewing Monetary values.
- **Invalid Postcodes**:
  - Presence of `postcode` values as 0 in both datasets indicates potential data entry errors. These should be cleaned or flagged during preprocessing to ensure accurate geographic analysis.
- **Data Volume**:
  - With 67,800 sales records, `sales_data.csv` is substantial. Performance optimization (e.g., using efficient data processing techniques in Pandas) will be important for scalability as the dataset grows.

## Conclusion

The data quality for both `customer_data.csv` and `sales_data.csv` is generally high, with minimal missing values and appropriate data types for analysis. Key identifiers like `customer_code` enable robust linking between datasets, crucial for RFM analysis. However, attention should be given to handling negative transaction values and invalid postcodes during data preprocessing to ensure accurate results. This report serves as a reference for all data-related tasks in the Adheseal RFM Analysis Dashboard project, supporting consistent and informed data handling.
