# System Patterns: Adheseal RFM Analysis Dashboard

## System Architecture

The Adheseal RFM Analysis Dashboard is built on a decoupled architecture that strictly separates the backend and frontend components to ensure modularity, scalability, and maintainability.

- **Backend (Python & FastAPI)**:

  - **Responsibility**: Solely focused on data loading, RFM calculations, and data exposure through a REST API. It is agnostic to how the data is displayed or interacted with by users.
  - **Structure**: Organized into a modular project layout with distinct directories for API endpoints (`app/api/`), business logic (`app/services/`), data models (`app/models/`), configuration (`app/core/`), and raw data (`app/data/`).
  - **Key Components**:
    - `main.py` for the FastAPI app instance and CORS middleware setup.
    - `endpoints.py` for defining API routes like `/rfm-data` and `/filters`.
    - `rfm_service.py` for core RFM calculation logic.
    - Pydantic models in `rfm.py` for data validation.

- **Frontend (React, Vite & Tailwind CSS)**:
  - **Responsibility**: Focused on fetching data from the backend API and rendering it in an interactive, user-friendly dashboard. It does not perform any RFM calculations or data processing.
  - **Structure**: Organized to promote component reusability with directories for components (`src/components/`), pages (`src/pages/`), API communication (`src/services/`), state management (`src/store/`), and assets (`src/assets/`).
  - **Key Components**:
    - `App.jsx` as the main application component.
    - `DashboardPage.jsx` for the primary dashboard view.
    - Reusable UI components like `KpiCard.jsx` and `FilterDropdown.jsx`.
    - `api.js` for centralized API calls.

## Key Technical Decisions

- **Decoupled Design**: The strict separation ensures that backend and frontend can be developed, tested, and scaled independently. This also allows for potential future replacements of either component without affecting the other.
- **API-First Approach**: Defining API contracts first using Pydantic models ensures data consistency and allows frontend development to proceed with mock data while backend logic is implemented.
- **CORS Configuration**: Essential for the backend to accept requests from the frontend development server (e.g., `http://localhost:5173`), managed via FastAPI's CORSMiddleware.

## Design Patterns in Use

- **Backend Patterns**:

  - **Service Layer Isolation**: Business logic, particularly RFM calculations, is isolated in the `services` directory (`rfm_service.py`). This keeps API endpoint functions lean and enhances reusability and testability.
  - **Dependency Injection**: Utilized in FastAPI to provide services or configurations to endpoint functions, improving modularity and testability.
  - **Pandas Best Practices**: Within the service layer, method chaining, early data type setting, and vectorization are employed to optimize data processing performance.

- **Frontend Patterns**:
  - **Component Reusability**: UI is broken into small, reusable components (e.g., `KpiCard.jsx`) to avoid duplication and ensure consistency across the dashboard.
  - **Centralized API Communication**: All API calls are managed in `api.js` to streamline endpoint management, error handling, and potential authentication needs.
  - **State Management**:
    - **Local State**: Managed with `useState` for component-specific state (e.g., dropdown open/closed status).
    - **Shared State**: Managed with Zustand or Context API for cross-component data like filters and RFM data, preventing prop drilling.
  - **Tailwind CSS Styling**: Utility classes are used directly in JSX for rapid development, with custom components or `@apply` directives for complex, repeated styles.

## Component Relationships

- **Backend to Frontend**: The backend exposes data via REST API endpoints which the frontend consumes. The relationship is unidirectional; the frontend requests data, and the backend responds without knowledge of the frontend's structure or needs.
- **Frontend Internal**: Components are hierarchically organized with pages (`DashboardPage.jsx`) containing reusable components (`KpiCard.jsx`, `FilterDropdown.jsx`). State management ensures data flows efficiently from API responses to UI rendering without unnecessary re-renders or complexity.
- **Backend Internal**: API endpoints rely on services for logic execution, services interact with data models for validation, and configuration settings are injected as dependencies, maintaining a clear separation of concerns.

## Critical Implementation Paths

- **API Contract Definition**: Establishing clear API endpoints and data models early allows parallel development of backend and frontend, with FastAPI's automatic Swagger documentation aiding in contract clarity.
- **Data Processing Pipeline**: From raw CSV data to RFM scores, the backend pipeline in `rfm_service.py` must handle data cleaning, validation, and calculation efficiently, adhering to Pandas best practices.
- **User Interaction Flow**: On the frontend, user interactions (e.g., applying filters) trigger API calls through `api.js`, update shared state, and re-render components as needed, ensuring a responsive user experience.
- **Future Scalability**: Design decisions consider future enhancements like caching (Redis), asynchronous data refresh (Celery), and database integration (PostgreSQL), ensuring current patterns do not hinder these upgrades.

This document outlines the architectural and design patterns guiding the development of the Adheseal RFM Analysis Dashboard, ensuring a robust, modular, and scalable system.
