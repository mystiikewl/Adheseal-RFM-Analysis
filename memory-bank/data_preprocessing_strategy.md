# Data Preprocessing Strategy: Adheseal RFM Analysis Dashboard

## Objective

This document outlines the data preprocessing strategy for the Adheseal RFM Analysis Dashboard project. It addresses data quality issues identified in `data_quality_report.md` to ensure accurate RFM (Recency, Frequency, Monetary) analysis. The strategy focuses on simple, effective rules to clean and prepare data without overcomplicating the initial implementation, while maintaining flexibility for future scalability.

## Data Sources

- **customer_data.csv**: Contains customer information (1,863 rows, 12 columns) with key identifier `customer_code`.
- **sales_data.csv**: Contains transaction data (67,800 rows, 11 columns) with key metrics for RFM analysis (`date`, `transaction_number`, `amount`).

## Preprocessing Checklist

The following checklist will be implemented in the backend (within `rfm_service.py`) to handle data quality issues before RFM calculations. Each step includes a rationale and implementation approach to maintain data integrity for customer segmentation.

### 1. Handling Negative Transaction Values (sales_data.csv)

- **Issue**: Negative values in `cost`, `amount`, and `profit` likely indicate refunds or returns, which can skew Monetary calculations in RFM analysis.
- **Strategy**: Exclude transactions with negative `amount` values from RFM calculations by default, as `amount` is the primary metric for Monetary value. Log the number of excluded transactions for transparency.
- **Implementation**: Filter out rows where `amount` < 0 during data loading in Pandas. Create a summary log (e.g., in a dedicated log file or console output) to report the count of excluded transactions.
- **Rationale**: This ensures that only positive revenue contributions are considered for customer value assessment, preventing distortion of Monetary scores. Logging maintains visibility into data adjustments for future review.
- **Future Consideration**: Optionally, allow configuration to include adjusted refund values (e.g., net transactions per customer) if business rules require accounting for returns.

### 2. Handling Missing Values (sales_data.csv)

- **Issue**: Minor missing values in `branch` (25 rows) and `delivery_suburb` (11 rows), which are not core to RFM calculations but may impact secondary segmentation.
- **Strategy**: Leave missing values as-is for non-critical fields since they do not affect core RFM metrics (`date`, `transaction_number`, `amount`). Flag these records in logs for potential future analysis.
- **Implementation**: During data loading, check for missing values in non-critical columns and log a summary of affected rows. No imputation or exclusion is applied at this stage.
- **Rationale**: Avoiding imputation keeps the process simple and prevents introducing assumptions into non-essential data. Logging ensures awareness of data gaps for future enhancements like geographic analysis.
- **Future Consideration**: Implement imputation (e.g., mode for `branch`) or exclusion if these fields become relevant for dashboard filters or segmentation.

### 3. Handling Invalid Postcodes (customer_data.csv and sales_data.csv)

- **Issue**: Postcodes with value 0 are invalid and indicate data entry errors, potentially affecting geographic segmentation.
- **Strategy**: Flag records with `postcode` = 0 as invalid for geographic analysis but retain them for RFM calculations since postcode is not a core RFM metric. Replace `postcode` = 0 with a placeholder (e.g., "INVALID") in processed data for clarity.
- **Implementation**: In Pandas, create a conditional replacement where `postcode` = 0 is set to "INVALID" during data cleaning. Log the count of affected records for both datasets.
- **Rationale**: Retaining these records ensures no loss of critical RFM data while clearly marking invalid entries for any geographic analysis. This approach balances data integrity with usability.
- **Future Consideration**: Develop a validation rule or external data check to correct invalid postcodes if geographic segmentation becomes a priority.

### 4. Ensuring Data Integrity for Linking

- **Issue**: `customer_code` must be consistent across `customer_data.csv` and `sales_data.csv` to link transactions to customer profiles for RFM analysis.
- **Strategy**: Validate that `customer_code` values in `sales_data.csv` exist in `customer_data.csv` before processing. Exclude sales records with unmatched `customer_code` from RFM calculations and log the count of excluded records.
- **Implementation**: Perform a merge or set intersection in Pandas to identify unmatched `customer_code` values during data loading. Filter out unmatched sales records and log the summary.
- **Rationale**: This ensures that RFM analysis is only performed on sales linked to known customers, maintaining accuracy in segmentation. Logging provides transparency for data reconciliation if needed.
- **Future Consideration**: Establish a data ingestion pipeline to flag or correct unmatched identifiers at the source if data updates are frequent.

### 5. Data Type Consistency

- **Issue**: Ensuring correct data types is critical for calculations and filtering (e.g., `date` as datetime, `amount` as float).
- **Strategy**: Enforce consistent data types during data loading to prevent runtime errors in RFM calculations.
- **Implementation**: Use Pandas to cast columns to appropriate types (e.g., `date` to `datetime64`, `amount` to `float64`, `customer_code` to `object` or `string`) immediately after loading. Log any conversion errors or anomalies.
- **Rationale**: Consistent data types prevent calculation errors and ensure reliable filtering and aggregation for RFM metrics.
- **Future Consideration**: Document expected data types in a schema file for validation if data sources expand or change.

## Performance Optimization for Large Datasets

- **Context**: With 67,800 sales records in `sales_data.csv`, efficient data processing is essential to maintain backend performance.
- **Strategy**: Use vectorized operations in Pandas (e.g., method chaining, avoiding loops) for all preprocessing and RFM calculation steps. Limit data copying by performing operations in-place where possible.
- **Implementation**: Structure `rfm_service.py` to leverage Pandas’ built-in vectorization for filtering, aggregations, and calculations. Profile performance during development to identify bottlenecks.
- **Rationale**: Vectorization significantly reduces processing time for large datasets, ensuring the backend remains responsive even as data grows.
- **Future Consideration**: Evaluate Polars as an alternative to Pandas for memory efficiency, or pre-calculate RFM scores for static data to reduce real-time computation overhead. Plan for caching (e.g., Redis) to store processed results for API efficiency.

## Logging and Transparency

- **Approach**: Maintain detailed logging of all preprocessing steps (e.g., counts of excluded records, data type conversions, flagged anomalies) to ensure transparency and support debugging.
- **Implementation**: Integrate logging within `rfm_service.py` using Python’s `logging` module, outputting summaries to console or a dedicated log file during data processing.
- **Rationale**: Transparent logging builds trust in data processing outcomes and facilitates troubleshooting if RFM results appear inconsistent or unexpected.
- **Future Consideration**: Expose high-level preprocessing summaries via an API endpoint for administrative users to review data health.

## Integration with Backend Development

- **Location**: All preprocessing logic will be implemented in the backend within `rfm_service.py` under the `app/services/` directory as part of the data loading pipeline.
- **Execution**: Preprocessing will occur before RFM calculations, ensuring only cleaned data is used for analysis. The pipeline will be triggered on data load or refresh (e.g., API startup, scheduled updates).
- **Validation**: Post-preprocessing validation checks will confirm data readiness for RFM calculations (e.g., no negative `amount` values remain in processed data), with results logged for review.

## Conclusion

This data preprocessing strategy addresses critical data quality issues identified in the datasets while maintaining simplicity for the initial implementation of the Adheseal RFM Analysis Dashboard. By focusing on exclusion of problematic data, logging for transparency, and performance optimization, the strategy ensures accurate RFM analysis without overcomplicating the backend logic. Future considerations are noted to support scalability and evolving business needs, aligning with the project's long-term goals.

This document will be updated as preprocessing needs evolve or new data quality insights emerge during development.
