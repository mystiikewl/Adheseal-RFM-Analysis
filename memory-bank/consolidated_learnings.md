# Consolidated Learnings: Adheseal RFM Analysis Dashboard

This file contains curated, summarized, and actionable insights derived from `raw_reflection_log.md`. It serves as the primary, refined knowledge base for long-term use.

## Backend Development

**FastAPI CORS Configuration**

- For development purposes, setting `allow_origins=["*"]` in FastAPI's CORSMiddleware allows requests from any origin, facilitating network access between frontend and backend.
- _Rationale:_ Simplifies connectivity during development by removing origin restrictions.
- _Caution:_ This should be restricted to specific origins in production to enhance security.

## Development Workflow

**Batch Script for Server Startup**

- Creating a batch file (e.g., `start_project.bat`) on Windows to launch multiple servers simultaneously using the `start` command can significantly improve development efficiency.
- _Implementation:_ Use `start "Title" cmd.exe /k "cd directory && command"` to open separate terminal windows for each server.
- _Rationale:_ Automates the startup process, reducing manual setup time and potential errors.

## Documentation Practices

**Memory Bank Updates**

- Regularly updating memory bank files is crucial for maintaining project continuity across sessions, especially after significant changes or user requests.
- _Practice:_ Review all core files (`activeContext.md`, `progress.md`, etc.) to ensure accurate documentation of project state, recent changes, and next steps.
- _Rationale:_ Ensures that after memory resets, the project context is preserved for effective continuation.
