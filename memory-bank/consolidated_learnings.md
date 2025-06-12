# Consolidated Learnings: Adheseal RFM Analysis Dashboard

This file contains curated, summarized, and actionable insights derived from the project development. It serves as the primary, refined knowledge base for long-term use.

## Backend Development

**FastAPI CORS Configuration**

- For development purposes, setting `allow_origins=["*"]` in FastAPI's CORSMiddleware allows requests from any origin, facilitating network access between frontend and backend.
- _Rationale:_ Simplifies connectivity during development by removing origin restrictions.
- _Caution:_ This should be restricted to specific origins in production to enhance security.

**Enhanced RFM Segmentation System**

- Implemented comprehensive 15-segment RFM classification system (expanded from basic 5 segments) providing granular customer insights: Champions, VIP Customers, Loyal Customers, Potential Loyalists, Recent Customers, Promising, Customers Needing Attention, About to Sleep, At Risk, Cannot Lose Them, Lost Customers, Hibernating, Price Sensitive, Bargain Hunters, Other.
- Centralized segment definitions in `segment_guide.py` with business logic, characteristics, and marketing strategies for each segment.
- _Rationale:_ Provides more actionable business insights and enables targeted marketing strategies based on specific customer behaviors.

**Data Table Enhancements**

- Enhanced data tables by calculating derived fields such as 'Customer average transaction spend' (total monetary divided by frequency) in the backend (`rfm_service.py`). Format dates (e.g., 'last_sale_date' as DD-MM-YY) for better readability.
- Streamline data by excluding unnecessary columns during data merge processes to focus on relevant information for analysis.
- _Rationale:_ Provides users with more insightful metrics and a cleaner dataset, improving decision-making capabilities.

## Frontend Development

**Advanced DataTable Development**

- **Dual Scrollbar Implementation**: Adding horizontal scrollbars at both top and bottom of tables significantly improves UX for wide tables by eliminating the need to scroll down first before horizontal navigation.
- **Robust Sorting System**: Implement type-aware sorting that properly handles numbers, dates, strings, and null values. Use separate comparison logic for each data type to prevent common sorting issues.
- **Column Visibility Management**: Users highly value granular control over data presentation. Implement persistent column show/hide functionality with localStorage integration.
- **Drag-and-Drop Integration**: Successfully combine drag-and-drop column reordering with click-based sorting by using proper event propagation handling (`e.stopPropagation()`).
- _Rationale:_ These features transform a basic data table into a professional-grade tool that matches enterprise application expectations.

**State Management Patterns**

- **LocalStorage Integration**: Persisting user preferences (column order, visibility, sort states) across sessions dramatically improves workflow efficiency for power users.
- **Component State Isolation**: Keep feature-specific state (dropdown visibility, temporary UI states) local to components while using centralized store (Zustand) for shared data.
- **Event Handling Best Practices**: Properly separate concerns between different interaction types (drag operations vs. click events) to prevent conflicts in complex UI components.
- _Rationale:_ Balanced approach between centralized state management and component autonomy improves both performance and maintainability.

**Comprehensive Segment Styling System**

- Implement logical color progression for RFM segments: Green (highest value) → Lime/Emerald (growth potential) → Yellow/Orange (attention needed) → Red (high risk/lost) → Blue (price-focused) → Gray (uncategorized).
- Always supplement color coding with text labels and icons for accessibility compliance.
- Use consistent color intensity to reflect business priority and risk levels.
- _Rationale:_ Visual hierarchy enables immediate understanding of customer value and risk levels without requiring detailed analysis.

**Tailwind CSS Best Practices**

- When using Tailwind CSS with Vite, ensure integration via the `@tailwindcss/vite` plugin rather than direct PostCSS plugins. Steps include:
  - Uninstalling conflicting packages like `@tailwindcss/postcss`.
  - Installing `tailwindcss` and `@tailwindcss/vite`.
  - Adding `@tailwindcss/vite` to the `plugins` array in `vite.config.js`.
  - Updating the main CSS file (e.g., `src/index.css`) to use `@import "tailwindcss";` instead of traditional `@tailwind` directives.
- _Rationale:_ Aligns with Vite's build system for correct processing of Tailwind styles, avoiding errors from outdated PostCSS setups.

**Accessibility & UX Excellence**

- **WCAG AA Compliance**: All interactive elements must meet contrast ratio requirements and include proper focus indicators using consistent accent colors (red theme).
- **Keyboard Navigation**: Every interactive element must be accessible via keyboard, including complex features like drag-and-drop column reordering.
- **Progressive Enhancement**: Build features that work well for both novice users (basic interactions) and power users (advanced functionality).
- **Visual Feedback**: Provide immediate visual feedback for all user interactions (hover states, loading indicators, success confirmations).
- _Rationale:_ Accessibility is not optional—it improves usability for all users while ensuring compliance with standards.

## Development Workflow

**Component Architecture Patterns**

- **Single Responsibility with Multiple Concerns**: Complex components like DataTable can handle multiple related concerns (sorting, filtering, column management) while maintaining clean internal organization through well-defined functions and state management.
- **Reusable Component Design**: Build components that can be easily extracted into shared libraries. Use consistent prop interfaces and avoid tight coupling to specific data structures.
- **Performance Optimization**: Use `useMemo` strategically for expensive computations, but avoid over-optimization. Focus on preventing unnecessary re-renders through proper component structure.
- _Rationale:_ Balances functionality richness with maintainability and performance.

**Testing & Quality Assurance**

- **Cross-Browser Testing**: Test complex interactions like drag-and-drop across different browsers, as implementation details can vary significantly.
- **Performance Testing**: Monitor table performance with realistic data volumes (1000+ rows) to identify bottlenecks before they become user-facing issues.
- **Accessibility Testing**: Use keyboard-only navigation and screen readers to verify all functionality is accessible.
- _Rationale:_ Early detection of issues prevents costly refactoring and ensures broad user compatibility.

**Batch Script for Server Startup**

- Creating a batch file (e.g., `start_project.bat`) on Windows to launch multiple servers simultaneously using the `start` command can significantly improve development efficiency.
- _Implementation:_ Use `start "Title" cmd.exe /k "cd directory && command"` to open separate terminal windows for each server.
- _Rationale:_ Automates the startup process, reducing manual setup time and potential errors.

**Shell-Specific Command Syntax**

- When executing commands on Windows systems using PowerShell, use ';' as the command separator instead of '&&' to ensure compatibility.
- _Rationale:_ Prevents syntax errors and ensures commands execute correctly in the user's shell environment.

## Project Management & Documentation

**Memory Bank Maintenance**

- Regularly updating memory bank files is crucial for maintaining project continuity across sessions, especially after significant changes or user requests.
- _Practice:_ Review all core files (`activeContext.md`, `progress.md`, etc.) to ensure accurate documentation of project state, recent changes, and next steps.
- _Rationale:_ Ensures that after memory resets, the project context is preserved for effective continuation.

**User-Centric Development Evolution**

- **Phase-Based Development**: Project evolved through distinct phases: Foundation → UI/UX Redesign → Data Enhancement → DataTable Excellence.
- **Feature Prioritization**: Shifted from implementing basic functionality to focusing on user experience and professional-grade features.
- **Feedback Integration**: User feedback drives feature prioritization and refinement direction.
- _Rationale:_ Iterative improvement based on user needs produces more valuable and usable software than feature-driven development.

**Success Metrics & Quality Gates**

- Establish clear quality gates for each development phase: Functional Requirements → User Experience → Performance → Accessibility → Maintainability → Scalability.
- Document and track success metrics to ensure project objectives are met consistently.
- _Rationale:_ Systematic quality assurance prevents technical debt and ensures long-term project success.
