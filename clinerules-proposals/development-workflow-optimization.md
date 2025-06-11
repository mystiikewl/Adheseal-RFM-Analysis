---
description: Guidelines for optimizing development workflows by automating common tasks such as server startup, environment setup, and routine operations.
author: Cline
version: 1.0
tags: ["workflow", "automation", "development", "optimization", "core-behavior"]
globs: ["*"] # This rule applies to all development projects.
---

# Development Workflow Optimization

**Objective:** Enhance development efficiency by automating repetitive tasks and providing tools or scripts for common operations in the development lifecycle. This rule guides Cline in preemptively creating solutions to streamline workflows, reducing manual effort and potential errors.

**Core Principle:** Automation and optimization are **essential** for productive development environments. Cline **should** proactively identify opportunities to automate tasks such as starting servers, setting up environments, or running tests, especially when user requests indicate a need for such tools.

---

## 1. Identifying Automation Opportunities

Cline **must** analyze user requests, project structures, and development patterns to identify tasks that are repetitive or time-consuming. Key areas for optimization include:

- **Server Startup**: Running backend and frontend servers simultaneously for full-stack applications.
- **Environment Setup**: Configuring environment variables, dependencies, or build tools.
- **Testing and Deployment**: Automating test execution or deployment processes.
- **Code Generation**: Creating boilerplate code or templates for common components or features.

**Trigger for Action:** When a user requests a specific workflow improvement (e.g., a script to start servers) or when Cline detects a pattern of manual repetition in tasks during a project.

---

## 2. Creating Automation Tools

### 2.1. Server Startup Scripts

- **Purpose**: Automate the process of launching multiple servers or services required for a project.
- **Implementation**:
  - For Windows, create batch files (`.bat`) using the `start` command to open separate terminal windows for each server.
    - Example: `start "Backend Server" cmd.exe /k "cd rfm_backend && uvicorn app.main:app --reload"`
  - For Unix-based systems (Linux, macOS), create shell scripts (`.sh`) using `&` to run commands in the background or `tmux` for multiple terminal sessions.
    - Example: `cd rfm_backend && uvicorn app.main:app --reload & cd rfm_frontend && npm run dev`
- **File Naming**: Use descriptive names like `start_project.bat` or `run_servers.sh` to clearly indicate purpose.
- **Location**: Place scripts in the project root directory for easy access unless specified otherwise by the user.

### 2.2. Environment Setup Scripts

- **Purpose**: Simplify the setup of development environments by automating dependency installation, environment variable configuration, or build processes.
- **Implementation**:
  - Create scripts to install dependencies (e.g., `npm install` for frontend, `pip install -r requirements.txt` for backend).
  - Automate environment variable setup by creating or updating `.env` files or using shell commands to export variables.
  - Example for Windows batch: `echo VITE_API_URL=http://localhost:8000 > rfm_frontend/.env`
- **Consideration**: Ensure scripts are compatible with the user's operating system (Windows, macOS, Linux).

### 2.3. Testing and Deployment Automation

- **Purpose**: Reduce manual effort in running tests or deploying applications by scripting these processes.
- **Implementation**:
  - Create scripts to run test suites (e.g., `pytest` for Python, `npm test` for JavaScript).
  - Automate deployment steps if applicable, such as building Docker images or pushing to repositories.
  - Example: A batch file `run_tests.bat` with `cd rfm_backend && pytest tests/`.

### 2.4. Code Generation Tools

- **Purpose**: Accelerate development by generating boilerplate code or templates for common project components.
- **Implementation**:
  - Develop scripts or use tools to create standardized files (e.g., React components, API endpoints).
  - Ensure generated code adheres to project-specific conventions and style guides.

---

## 3. Best Practices for Automation Scripts

- **Clarity and Documentation**: Include comments or `echo` statements in scripts to explain what each part does. For example, in a batch file: `echo Starting Backend Server...`
- **Error Handling**: Add basic error checking where possible, such as verifying directory existence before changing into it.
- **User Notification**: Inform the user about the purpose and usage of the script after creation, including how to execute it.
- **Cross-Platform Consideration**: If the project might be used across different operating systems, consider providing scripts for multiple platforms or note limitations.
- **Version Control**: Recommend adding scripts to version control to track changes and ensure availability across team members or environments.

---

## 4. Workflow Integration

- **Proactive Suggestion**: Cline **should** suggest automation tools early in a project or upon detecting repetitive tasks, even if not explicitly requested by the user.
- **User Confirmation**: Before creating complex scripts, confirm with the user if they want the automation tool and if they have specific preferences for implementation.
- **Documentation**: Update relevant memory bank files (e.g., `activeContext.md`, `progress.md`) to note the creation and purpose of automation scripts under recent changes or key learnings.

---

## 5. Example Workflow for Server Startup Script

1. **Identify Need**: User requests a way to start both backend and frontend servers simultaneously, or Cline notices manual server startup in project logs.
2. **Propose Solution**: Suggest creating a batch file (Windows) or shell script (Unix) to automate server startup.
3. **Create Script**: Write the script tailored to the project structure, ensuring correct directory paths and commands (e.g., `uvicorn` for FastAPI, `npm run dev` for Vite).
4. **Inform User**: Notify the user about the script's location and how to run it (e.g., double-click or command line execution).
5. **Document**: Update memory bank files to reflect the addition of this workflow optimization tool.

This rule ensures that Cline actively contributes to a more efficient development environment by automating routine tasks, aligning with user needs and project requirements.
