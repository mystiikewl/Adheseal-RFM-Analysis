# Project Progress: RFM Analysis Dashboard

## Current Status: Backend Complete, Ready for Frontend Development

The backend for the RFM Analysis Dashboard is fully complete with all critical functionalities implemented and tested. Dynamic filter options and refined RFM metrics are now in place, and all unit and integration tests are passing. The project is now ready to transition to frontend development for user interface implementation.

## What Works

- **Data Loading & Preprocessing:**
  - Customer and sales data are loaded correctly from CSV files.
  - Data preprocessing steps, including data type enforcement, handling of invalid postcodes (marking as "INVALID"), exclusion of negative transaction amounts, and ensuring data integrity for linking, are functional.
- **RFM Calculation Service (`rfm_service.py`):**
  - Raw RFM metrics (Recency, Frequency, Monetary) are calculated correctly.
  - Recency calculation uses the earliest transaction date as the reference point for a comprehensive view of customer engagement, with higher scores for more recent activity.
  - RFM scores (1-5 for each metric) are assigned using quintile-based binning (`pd.qcut`), with 5 being the best for all metrics.
  - Quintile cut-off values are logged for transparency in scoring.
  - The binning logic includes a fallback mechanism to handle cases with insufficient unique data points for 5 quintiles, preventing crashes.
  - Combined RFM scores (e.g., "555") are generated.
  - Customer segmentation logic categorizes customers into groups like VIP Customers, Customers with Potential, At Risk, and Hibernating based on RFM scores.
  - `NaN` values resulting from calculations or data issues are converted to Python `None` before data is returned by the service.
  - Resolved `FutureWarning`s related to Pandas dtype assignments by using explicit type casting methods like `.replace()` and `.astype(str)`.
- **API Endpoints (`endpoints.py`):**
  - `/api/rfm-data`: Successfully retrieves and returns the processed RFM data. JSON serialization issues with `NaN` and other special data types have been resolved through explicit type handling and the use of FastAPI's `jsonable_encoder`.
  - `/api/filters`: Dynamically populates filter options based on unique values from the dataset for fields such as "customer_group", "customer_type", "customer_ranking", and "state", ensuring relevance for user-driven segmentation.
- **Testing (`test_rfm_service.py`, `test_endpoints.py`):**
  - All 5 unit and integration tests are passing.
  - Mocking for service dependencies in endpoint tests is correctly implemented using `monkeypatch` by targeting the lookup path of the function (`app.api.endpoints.get_rfm_data`).
  - Tests cover data loading, preprocessing logic, RFM score calculation, and API endpoint responses.

## What's Left to Build / Next Steps

- **Frontend Development:**
  - Design and implement the user interface for displaying RFM data, segments, and filters.
  - Integrate the frontend with the backend API to fetch and display data dynamically.
- **Filter Functionality:**
  - Develop backend logic to apply user-selected filters from the frontend to dynamically adjust the RFM data returned by the API.
- **Deployment Strategy:**
  - Plan and document the deployment process for the backend and frontend components.
- **Documentation:**
  - Finalize API documentation.
  - Create user documentation if required.
- **User Feedback:**
  - Gather user feedback on the RFM metrics, segmentation, and overall dashboard functionality to ensure alignment with business objectives.

## Known Issues / Considerations

- **Static Filter Application:** The `/api/filters` endpoint returns dynamic filter options, but the backend logic to apply these filters to the RFM data based on user selections is not yet implemented. This will be addressed in the next phase alongside frontend integration.
- **Data Pathing for Deployment:** Currently, data paths in `rfm_service.py` use a hardcoded absolute path for `BASE_DIR`. This may need to be revisited for portability/deployment using environment variables or configuration files.

## Evolution of Project Decisions

- **Data Pathing:** Initially used relative paths, then dynamic absolute paths, and finally settled on a hardcoded absolute path for `BASE_DIR` in `rfm_service.py` for simplicity in the current development environment. This might need to be revisited for portability/deployment using environment variables or configuration files.
- **NaN Handling in API:** Went through several iterations to ensure `NaN` values from Pandas/NumPy were correctly serialized to `null` in JSON responses:
  1. `df.where(df.notna(), None)` in the service layer.
  2. Custom `JSONEncoder` in the endpoint layer.
  3. Direct return of `to_dict()` from endpoint.
  4. Finally, a more explicit manual conversion loop within the endpoint combined with `jsonable_encoder` to ensure robust handling.
- **Test Mocking:** Corrected the `monkeypatch` target from the definition path to the lookup path of the service function within the endpoint module to ensure mocks were applied effectively during endpoint testing.
- **RFM Recency Logic:** Updated Recency calculation to use the earliest transaction date as the reference point, aligning the scoring logic so that higher scores reflect more recent activity, which is more intuitive for business analysis.
- **Quintile Transparency:** Added logging for quintile cut-off values to provide clarity on how RFM scores are determined, aiding in business interpretation and debugging.
