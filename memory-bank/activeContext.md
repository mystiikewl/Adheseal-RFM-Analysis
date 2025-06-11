# Active Context: Adheseal RFM Analysis Dashboard

## Current Work Focus

As of the latest update, the focus of the Adheseal RFM Analysis Dashboard project has shifted to data preparation and quality assessment. This involves analyzing the datasets (`customer_data.csv` and `sales_data.csv`) to ensure they are suitable for RFM (Recency, Frequency, Monetary) analysis, documenting data quality, and establishing a robust foundation for backend data processing.

## Recent Changes

- **Memory Bank Initialization**: Core documentation files (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, and `progress.md`) have been created, establishing the foundation for project documentation.
- **Data Analysis and Documentation**:
  - Created `data_headers.json` to document column headers for datasets, ensuring accurate reference for backend functions.
  - Developed and executed `data_analyzer.py` to analyze dataset structure, completeness, and key metrics.
  - Added `data_quality_report.md` to the Memory Bank, summarizing data quality insights, key identifiers, and considerations for preprocessing.
- No development work on the actual backend or frontend application logic has commenced yet.

## Next Steps

- **Data Preprocessing Strategy**: Define strategies for handling data quality issues identified in `data_quality_report.md`, such as negative transaction values and invalid postcodes, to prepare datasets for RFM calculations.
- **Project Structure Planning**: Begin planning the detailed directory structure for both backend (Python/FastAPI) and frontend (React/Vite) components as outlined in the project briefing.
- **Development Initiation**: Start setting up the backend environment, including dependencies and initial API structure for RFM calculations, followed by frontend setup with necessary tools and libraries.
- **API Contract Definition**: Define the initial API endpoints and data models to establish a clear contract between backend and frontend teams, incorporating validated data structures from the analysis.

## Active Decisions and Considerations

- **Decoupled Architecture**: Ensuring strict separation between backend data processing and frontend visualization to maintain modularity.
- **Scalability**: Considering future enhancements like caching and database integration from the start to avoid architectural rework, especially given the data volume in `sales_data.csv`.
- **Data Quality**: Prioritizing data cleaning and preprocessing to ensure accurate RFM analysis, based on insights from the data quality report.
- **User Feedback**: Remaining open to incorporating user feedback on the Memory Bank structure, data handling strategies, or project priorities as development progresses.

## Important Patterns and Preferences

- **Documentation First**: Prioritize thorough documentation at each stage to support memory retention across sessions, adhering to the Memory Bank protocol.
- **Modular Design**: Follow best practices for modular code structure in both backend and frontend to facilitate maintenance and scalability.
- **Data-Driven Decisions**: Use insights from data analysis to inform backend logic and ensure RFM calculations are based on accurate, well-understood datasets.

## Learnings and Project Insights

- **Initialization Importance**: Establishing a robust Memory Bank at the project's outset is critical for maintaining context and ensuring all team members (and future sessions) are aligned with project goals and architecture.
- **Data Quality Criticality**: Early analysis of datasets reveals the importance of addressing data quality issues (e.g., missing values, negative transactions) before proceeding with RFM calculations to avoid skewed results.
- **Documentation as Reference**: Creating detailed references like `data_quality_report.md` ensures consistency in data handling and supports informed decision-making in subsequent development phases.

This document captures the current state of focus and immediate next steps for the Adheseal RFM Analysis Dashboard, guiding the transition from data preparation to active development.
