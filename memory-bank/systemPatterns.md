# System Patterns: Adheseal RFM Analysis Dashboard

## System Architecture

The Adheseal RFM Analysis Dashboard is built on a decoupled architecture that strictly separates the backend and frontend components to ensure modularity, scalability, and maintainability.

- **Backend (Python & FastAPI)**:

  - **Responsibility**: Solely focused on data loading, RFM calculations, and data exposure through a REST API. It is agnostic to how the data is displayed or interacted with by users.
  - **Structure**: Organized into a modular project layout with distinct directories for API endpoints (`app/api/`), business logic (`app/services/`), data models (`app/models/`), configuration (`app/core/`), and raw data (`app/data/`).
  - **Key Components**:
    - `main.py` for the FastAPI app instance and CORS middleware setup.
    - `endpoints.py` for defining API routes like `/rfm-data` and `/filters`.
    - `rfm_service.py` for core RFM calculation logic with 15 comprehensive segments.
    - Pydantic models in `rfm.py` for data validation.
    - `segment_guide.py` for comprehensive segment definitions and business logic.

- **Frontend (React, Vite & Tailwind CSS)**:
  - **Responsibility**: Focused on fetching data from the backend API and rendering it in an interactive, user-friendly dashboard. It does not perform any RFM calculations or data processing.
  - **Structure**: Organized to promote component reusability with directories for components (`src/components/`), pages (`src/pages/`), API communication (`src/services/`), state management (`src/store/`), and assets (`src/assets/`).
  - **Key Components**:
    - `App.jsx` as the main application component with theme support.
    - `DashboardPage.jsx` for the primary dashboard view with integrated visualizations.
    - Advanced UI components like `DataTable.jsx` with enterprise-grade functionality.
    - Reusable UI components like `KpiCard.jsx`, `FilterDropdown.jsx`, and `TrendSparkline.jsx`.
    - `api.js` for centralized API calls.
    - `rfmStore.js` for state management with Zustand.

## Key Technical Decisions

- **Decoupled Design**: The strict separation ensures that backend and frontend can be developed, tested, and scaled independently. This also allows for potential future replacements of either component without affecting the other.
- **API-First Approach**: Defining API contracts first using Pydantic models ensures data consistency and allows frontend development to proceed with mock data while backend logic is implemented.
- **CORS Configuration**: Essential for the backend to accept requests from the frontend development server (e.g., `http://localhost:5173`), managed via FastAPI's CORSMiddleware.
- **Enhanced Segmentation**: Expanded from basic 5-segment RFM to comprehensive 15-segment system for granular customer analysis.

## Design Patterns in Use

- **Backend Patterns**:

  - **Service Layer Isolation**: Business logic, particularly RFM calculations, is isolated in the `services` directory (`rfm_service.py`). This keeps API endpoint functions lean and enhances reusability and testability.
  - **Domain Knowledge Separation**: Customer segment definitions and business rules are centralized in `segment_guide.py` for maintainability.
  - **Dependency Injection**: Utilized in FastAPI to provide services or configurations to endpoint functions, improving modularity and testability.
  - **Pandas Best Practices**: Within the service layer, method chaining, early data type setting, and vectorization are employed to optimize data processing performance.

- **Frontend Patterns**:
  - **Advanced Component Architecture**: Complex components like `DataTable.jsx` implement multiple concerns (sorting, filtering, column management, persistence) while maintaining clean separation.
  - **Hook-Based State Management**: Custom hooks and React patterns for managing complex UI state (column visibility, sort configuration, drag-and-drop).
  - **Persistent User Preferences**: LocalStorage integration for maintaining user settings across sessions.
  - **Component Reusability**: UI is broken into small, reusable components (e.g., `KpiCard.jsx`, `TrendSparkline.jsx`) to avoid duplication and ensure consistency.
  - **Centralized API Communication**: All API calls are managed in `api.js` to streamline endpoint management, error handling, and potential authentication needs.
  - **State Management**:
    - **Local State**: Managed with `useState` for component-specific state (e.g., dropdown open/closed status, column visibility).
    - **Shared State**: Managed with Zustand for cross-component data like filters, theme preferences, and RFM data.
  - **Tailwind CSS Styling**: Utility classes are used directly in JSX for rapid development, with systematic color palette and spacing patterns.

## Component Relationships

- **Backend to Frontend**: The backend exposes data via REST API endpoints which the frontend consumes. The relationship is unidirectional; the frontend requests data, and the backend responds without knowledge of the frontend's structure or needs.

- **Frontend Internal**:

  - **Hierarchical Structure**: Pages (`DashboardPage.jsx`) contain complex components (`DataTable.jsx`) which contain simpler components (`TrendSparkline.jsx`).
  - **State Flow**: Data flows from API responses through Zustand store to components, with local state for UI-specific concerns.
  - **Event Propagation**: Complex interactions like drag-and-drop column reordering work alongside click events for sorting through proper event handling.

- **Backend Internal**: API endpoints rely on services for logic execution, services interact with data models for validation, and configuration settings are injected as dependencies, maintaining a clear separation of concerns.

## Critical Implementation Paths

### Data Processing Pipeline

- **Raw Data → RFM Scores**: From CSV data through cleaning, calculation, and 15-segment classification in `rfm_service.py`.
- **Enhanced Data Formatting**: User-friendly recency displays, trend calculations, and segment assignments.

### User Interaction Flows

- **DataTable Interactions**: Multi-layered interaction system supporting:
  - Column reordering via drag-and-drop
  - Sorting with type-aware comparison
  - Column visibility management with persistence
  - Horizontal scrolling with dual scrollbars
- **Filter Application**: User selections trigger API calls through `api.js`, update Zustand store, and re-render components.
- **Theme Management**: Theme changes propagate through Zustand to all components instantly.

### Performance Optimizations

- **Frontend Memoization**: Strategic use of `useMemo` for expensive data transformations.
- **Efficient Rendering**: Proper React key usage and component isolation to prevent unnecessary re-renders.
- **Backend Caching**: Computed RFM data structure optimized for frontend consumption.

### Accessibility Implementation

- **Keyboard Navigation**: Full keyboard support for all interactive elements including drag-and-drop.
- **WCAG AA Compliance**: Color contrast ratios, focus indicators, and screen reader support.
- **Progressive Enhancement**: Features work with basic interactions and are enhanced with advanced capabilities.

## Future Scalability Patterns

### Backend Evolution

- **Database Integration**: Current CSV-based system designed for easy migration to PostgreSQL.
- **Caching Layer**: Redis integration planned for RFM calculation caching.
- **API Versioning**: Endpoint structure supports future versioning needs.

### Frontend Scalability

- **Component Library**: Reusable components ready for extraction into shared library.
- **State Management**: Zustand store structure supports complex application growth.
- **Build Optimization**: Vite configuration optimized for production builds and code splitting.

### Data Volume Handling

- **Pagination Support**: DataTable architecture supports future pagination implementation.
- **Virtual Scrolling**: Component structure allows for virtual scrolling upgrade for large datasets.
- **Incremental Loading**: API design supports future incremental data loading patterns.

This document outlines the architectural and design patterns guiding the development of the Adheseal RFM Analysis Dashboard, ensuring a robust, modular, and scalable system that can evolve with user needs and data growth.
