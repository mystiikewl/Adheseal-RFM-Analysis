# Tech Context: Adheseal RFM Analysis Dashboard

## Technologies Used

The Adheseal RFM Analysis Dashboard leverages a modern tech stack designed for performance, scalability, and developer productivity, split between backend and frontend components.

- **Backend Technologies**:

  - **Python**: The primary programming language for backend development, chosen for its robust data processing libraries and ease of use.
  - **FastAPI**: A high-performance web framework for building the REST API, selected for its speed, automatic API documentation (Swagger), and dependency injection capabilities.
  - **Pandas**: Used for data manipulation and RFM calculations, optimized with best practices like method chaining and vectorization.
  - **Pydantic**: For data validation and defining strict API contracts, ensuring consistency in data structures.

- **Frontend Technologies**:

  - **React**: The JavaScript library for building the user interface, chosen for its component-based architecture and wide ecosystem support.
  - **Vite**: A fast build tool and development server for the frontend, providing quick hot module replacement and optimized builds.
  - **Tailwind CSS**: A utility-first CSS framework for rapid styling directly in JSX, ensuring a consistent and responsive design with minimal custom CSS.
  - **Zustand or Context API**: For state management, handling shared state across components to avoid prop drilling (alternative to Redux for lighter applications).

- **Potential Future Enhancements**:
  - **Redis**: For caching RFM calculation results to improve API response times.
  - **Celery or FastAPI-Scheduler**: For asynchronous background jobs to refresh data periodically.
  - **PostgreSQL**: For potential migration from CSV files to a relational database for better data integrity and scalability.
  - **Polars**: As an alternative to Pandas for more memory-efficient data processing with large datasets.
  - **Shadcn/UI or MUI**: UI component libraries to accelerate frontend development and ensure a professional look.

## Development Setup

- **Backend Setup**:

  - **Project Structure**: Organized under `rfm_backend/` with subdirectories for application logic (`app/`), tests (`tests/`), and configuration files.
  - **Environment Variables**: Managed via a `.env` file for sensitive or environment-specific configurations (e.g., API keys, database URLs if applicable).
  - **Dependencies**: Listed in `requirements.txt` to ensure consistent Python package installations across development environments.
  - **CORS Configuration**: Configured in `main.py` to allow requests from the frontend development server (e.g., `http://localhost:5173`).

- **Frontend Setup**:

  - **Project Structure**: Organized under `rfm_frontend/` with source code in `src/`, static assets in `public/`, and configuration files at the root.
  - **Environment Variables**: Managed via a `.env` file, specifically for settings like the backend API URL (`VITE_API_URL`).
  - **Dependencies**: Managed via `package.json` for JavaScript libraries and tools, ensuring consistent builds with npm or yarn.
  - **Development Server**: Runs on Vite, typically at `http://localhost:5173`, providing fast refresh during development.

- **Version Control**: Recommended to use Git, either as a monorepo containing both backend and frontend or as separate repositories. A monorepo is often simpler for smaller teams to manage.

- **Future DevOps Considerations**:
  - **Docker and Docker Compose**: To containerize both frontend and backend for consistent development and deployment environments.
  - **CI/CD Pipelines**: Using tools like GitHub Actions to automate testing and deployment processes.

## Technical Constraints

- **Data Source**: Initially reliant on CSV files (`customer_data.csv` and `sales_data.csv`) for data input, which may pose limitations with data integrity and scalability until a database migration is implemented.
- **Performance with Scale**: Pandas may struggle with very large datasets (millions of rows), necessitating future optimization with Polars or a pre-calculation model.
- **API Security**: Currently, no authentication is specified, posing a risk of data exposure. Future implementation of API keys or OAuth2 is recommended.
- **State Management Complexity**: As frontend features grow, state management can become complex, requiring strict adherence to chosen patterns (Zustand or Context API) to avoid bugs.

## Dependencies

- **Backend Dependencies** (via `requirements.txt`):

  - FastAPI and associated libraries (e.g., `uvicorn` for server).
  - Pandas for data processing.
  - Pydantic for data models and validation.
  - Additional utilities as needed for data cleaning or potential future database connections.

- **Frontend Dependencies** (via `package.json`):
  - React and React DOM for UI rendering.
  - Vite for build and development server.
  - Tailwind CSS and related plugins (`postcss`, `autoprefixer`) for styling.
  - Zustand or other state management libraries if chosen.
  - Axios or Fetch API (built-in) for API communication.

## Tool Usage Patterns

- **FastAPI Swagger UI**: Automatically generated API documentation accessed via `/docs` endpoint for backend API contract verification and testing.
- **Vite Development Server**: Used for rapid frontend development with hot module replacement to see changes instantly.
- **Git for Version Control**: Essential for tracking changes, collaborating, and potentially setting up CI/CD pipelines.
- **Testing Frameworks**: Backend tests to be placed in `tests/` directory using tools like `pytest`; frontend testing potentially with Jest or React Testing Library, though not yet specified in detail.

This document details the technological foundation and setup for the Adheseal RFM Analysis Dashboard, guiding developers in maintaining consistency across environments and preparing for future scalability.
