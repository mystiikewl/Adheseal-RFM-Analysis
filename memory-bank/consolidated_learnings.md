# Consolidated Learnings: Adheseal RFM Analysis Dashboard

This file contains curated, summarized, and actionable insights derived from `raw_reflection_log.md`. It serves as the primary, refined knowledge base for long-term use.

## Backend Development

**FastAPI CORS Configuration**

- For development purposes, setting `allow_origins=["*"]` in FastAPI's CORSMiddleware allows requests from any origin, facilitating network access between frontend and backend.
- _Rationale:_ Simplifies connectivity during development by removing origin restrictions.
- _Caution:_ This should be restricted to specific origins in production to enhance security.

**Data Table Enhancements**

- Enhanced data tables by calculating derived fields such as 'Customer average transaction spend' (total monetary divided by frequency) in the backend (`rfm_service.py`). Format dates (e.g., 'last_sale_date' as DD-MM-YY) for better readability.
- Streamline data by excluding unnecessary columns during data merge processes to focus on relevant information for analysis.
- _Rationale:_ Provides users with more insightful metrics and a cleaner dataset, improving decision-making capabilities.

## Frontend Development

**Tailwind CSS Troubleshooting Checklist**

- When using Tailwind CSS with Vite, ensure integration via the `@tailwindcss/vite` plugin rather than direct PostCSS plugins. Steps include:
  - Uninstalling conflicting packages like `@tailwindcss/postcss`.
  - Installing `tailwindcss` and `@tailwindcss/vite`.
  - Adding `@tailwindcss/vite` to the `plugins` array in `vite.config.js`.
  - Updating the main CSS file (e.g., `src/index.css`) to use `@import "tailwindcss";` instead of traditional `@tailwind` directives.
- _Rationale:_ Aligns with Vite's build system for correct processing of Tailwind styles, avoiding errors from outdated PostCSS setups.
- Emphasize reading and trusting specific error messages from build tools, as they often guide directly to the solution.

**Updated Filter Set and Data Connection Strategies**

- Filters in the RFM Analysis Dashboard have been updated to include Customer Type, Salesperson, and Segment, implemented across backend API (`endpoints.py`), frontend state management (`rfmStore.js`), and UI (`DashboardPage.jsx`).
- Resolved data connection issues by ensuring the backend server is running and accessible, stabilizing the connection between frontend and backend.
- _Rationale:_ Keeps filter options relevant to user needs and ensures reliable data flow for accurate analysis display.

**Data Table UI Updates**

- Update frontend components (e.g., `DataTable.jsx`) to reflect backend data changes by adding new columns (e.g., 'Avg Spend', 'Last Sale') and removing irrelevant ones. Ensure formatting consistency for monetary values across columns.
- Adjust export functionalities like CSV to match the updated data structure for user convenience.
- _Rationale:_ Maintains UI consistency with backend data, enhancing user experience through accurate and formatted data representation.

**Chart.js Component Best Practices**

- **Data Structure Alignment**: Ensure data passed from parent components (e.g., `DashboardPage.jsx`) to charting components (e.g., `SegmentTreemap.jsx`, `RfmHeatmap.jsx`) precisely matches the properties expected by the chart library and component. Mismatched property names (e.g., `segment` vs. `name`) can lead to rendering failures.
- **Dynamic Data Handling**: For charts with togglable views (e.g., count vs. monetary), ensure the parent component provides all necessary data points, and the charting component dynamically selects and uses the correct data based on its internal state.
- **Lifecycle Management**: Properly destroy and nullify Chart.js instances in `useEffect` cleanup functions to prevent "Canvas is already in use" errors, especially during rapid re-renders or component unmounting. Explicitly setting `chartInstance.current = null` after `destroy()` is crucial.
- **Robust Data Access**: Implement null/undefined checks when accessing properties from `context.raw` within Chart.js callbacks (e.g., `backgroundColor`, `tooltip.callbacks.label`) to prevent `TypeError` if data points are unexpectedly missing or malformed.

## Development Workflow

**Batch Script for Server Startup**

- Creating a batch file (e.g., `start_project.bat`) on Windows to launch multiple servers simultaneously using the `start` command can significantly improve development efficiency.
- _Implementation:_ Use `start "Title" cmd.exe /k "cd directory && command"` to open separate terminal windows for each server.
- _Rationale:_ Automates the startup process, reducing manual setup time and potential errors.

**Shell-Specific Command Syntax**

- When executing commands on Windows systems using PowerShell, use ';' as the command separator instead of '&&' to ensure compatibility.
- _Rationale:_ Prevents syntax errors and ensures commands execute correctly in the user's shell environment.

## Documentation Practices

**Memory Bank Updates**

- Regularly updating memory bank files is crucial for maintaining project continuity across sessions, especially after significant changes or user requests.
- _Practice:_ Review all core files (`activeContext.md`, `progress.md`, etc.) to ensure accurate documentation of project state, recent changes, and next steps.
- _Rationale:_ Ensures that after memory resets, the project context is preserved for effective continuation.
