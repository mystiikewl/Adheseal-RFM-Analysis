# RFM Analysis Guidelines: Adheseal RFM Analysis Dashboard

## Objective

This document outlines workflow-specific rules and best practices for the Adheseal RFM Analysis Dashboard project to enhance effectiveness and efficiency in data handling, RFM analysis, development processes, and continuous improvement. These guidelines are designed to align with the project's decoupled architecture, technical stack, and long-term scalability goals.

## Data Handling and RFM Analysis Workflow

- **Data Loading and Cleaning**:

  - All data loading from CSV files (`customer_data.csv`, `sales_data.csv`) must occur on the backend using Pandas. Implement validation checks for missing values, incorrect data types, and duplicate entries before processing.
  - Use a standardized function in `rfm_service.py` to handle data ingestion, ensuring consistent column naming and data type casting (e.g., dates as `datetime64`, monetary values as `float64`).
  - Log data quality issues and cleaning steps in a dedicated section of `memory-bank/progress.md` to track potential impacts on RFM results.

- **RFM Calculation Pipeline**:

  - Define a clear, modular pipeline in `rfm_service.py` for calculating Recency, Frequency, and Monetary scores. Use vectorized Pandas operations to optimize performance, avoiding loops where possible.
  - Assign RFM scores based on quintiles or predefined thresholds, ensuring the logic is well-documented within the code and summarized in this guideline for future reference.
  - Output RFM data in a structured format via API endpoints, validated by Pydantic models to maintain data integrity.

- **Documentation**:
  - Document the data processing and RFM calculation logic in this file, including any assumptions (e.g., handling of missing data, threshold definitions for RFM scores).
  - Update this section with any optimizations or changes to the RFM methodology as development progresses.

## Development Workflow for Decoupled Architecture

- **API Contract Definition**:

  - Prioritize the definition of API contracts using Pydantic models in `app/models/rfm.py` before implementing backend logic or frontend data fetching. This ensures a clear interface for data exchange.
  - Use FastAPI's automatic Swagger documentation (`/docs`) to verify and share API contracts with the frontend team, enabling parallel development with mock data if needed.

- **Backend Development Checklist**:

  - Each API endpoint in `endpoints.py` must include input validation, error handling (e.g., 400 for invalid filters, 500 for server errors), and logging of request parameters for debugging.
  - Isolate business logic in `rfm_service.py`, keeping endpoint functions lean and focused on request/response handling.
  - Configure CORS in `main.py` to allow requests from the frontend development server (e.g., `http://localhost:5173`).

- **Frontend Development Checklist**:

  - Develop reusable UI components in `src/components/` (e.g., `KpiCard.jsx`, `FilterDropdown.jsx`) to ensure consistency across the dashboard.
  - Centralize API communication in `src/services/api.js` for managing endpoint URLs, error handling, and potential future authentication.
  - Manage state using Zustand or Context API for shared data (e.g., active filters, RFM data), avoiding prop drilling and ensuring efficient re-renders.
  - Style components with Tailwind CSS utility classes directly in JSX for rapid development, using custom components or `@apply` directives for complex, repeated styles.

- **Documentation**:
  - Document key development decisions, challenges, and solutions in `memory-bank/activeContext.md` to maintain context across sessions.
  - Update `memory-bank/systemPatterns.md` with any new design patterns or architectural adjustments as they are implemented.

## Testing and Validation Workflow

- **Backend Testing**:

  - Write unit tests for RFM calculation logic in `rfm_service.py` using `pytest`, covering edge cases (e.g., empty datasets, missing columns) and expected outputs.
  - Implement integration tests for API endpoints to validate request/response behavior, including error conditions.
  - Place all tests in the `tests/` directory with clear naming conventions (e.g., `test_rfm_service.py`, `test_endpoints.py`).

- **Frontend Testing**:

  - Test critical UI components (e.g., filter application, data rendering) using Jest or React Testing Library to ensure correct behavior and state updates.
  - Mock API responses in frontend tests to isolate UI logic from backend dependencies, using tools like `msw` (Mock Service Worker) if applicable.

- **Documentation**:
  - Track test coverage goals and results in `memory-bank/progress.md`, noting areas of low coverage or known issues for future improvement.
  - Document test setup instructions or scripts in this file to ensure consistency across development environments.

## Continuous Improvement and Self-Reflection Protocol

- **Reflection Logging**:

  - After completing significant tasks, solving problems, or receiving user feedback, log detailed reflections in `memory-bank/raw_reflection_log.md`. Include learnings, difficulties, successes, and potential improvements.
  - Use a timestamped, task-referenced format for each entry to maintain a clear history of insights.

- **Knowledge Consolidation**:

  - Periodically review `memory-bank/raw_reflection_log.md` to identify durable, actionable insights for RFM analysis, API performance, frontend UX, or development workflows.
  - Summarize and transfer these insights to `memory-bank/consolidated_learnings.md`, organizing by topic (e.g., RFM Optimization, API Best Practices) for easy retrieval.
  - Prune processed entries from `raw_reflection_log.md` to keep it focused on recent, unprocessed reflections.

- **Documentation**:
  - Update `memory-bank/activeContext.md` with ongoing learnings and project insights to guide immediate next steps.
  - Ensure `memory-bank/consolidated_learnings.md` remains concise, actionable, and free of redundant or outdated information.

## Future Considerations

- **Scalability Enhancements**:

  - Plan for caching RFM results (e.g., Redis) to improve API response times, documenting initial strategies in this file.
  - Prepare for database migration (e.g., PostgreSQL) by defining data schema requirements early, to be updated here as decisions are made.
  - Evaluate alternatives like Polars for data processing if Pandas performance becomes a bottleneck, noting findings in `memory-bank/progress.md`.

- **Security Measures**:
  - Outline initial API security strategies (e.g., API keys, OAuth2) in this file to address data exposure risks, updating as implementation progresses.

This document serves as a living guideline for the Adheseal RFM Analysis Dashboard project, to be updated with new workflows, best practices, and learnings as development continues.
