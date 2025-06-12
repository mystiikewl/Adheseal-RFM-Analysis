# Component Library for Adheseal RFM Analysis Dashboard

## Overview

This document outlines the reusable UI components used in the Adheseal RFM Analysis Dashboard. Each component is designed to support both light and dark themes with red accents for interactive elements, ensuring a consistent and modern user experience. The styling adheres to the guidelines in `styleGuide.md` and uses Tailwind CSS classes defined in `tailwind.config.js`.

## Core Components

### KpiCard

- **Purpose**: Displays key performance indicators (KPIs) such as total customers, VIP customers, at-risk customers, and average recency.
- **Props**:
  - `title`: The title of the KPI (e.g., "Total Customers")
  - `value`: The numerical or formatted value of the KPI
  - `description`: A short description of what the KPI represents
- **Styling**:
  - Container: `bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-32`
  - Title: `text-lg font-semibold text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark`
  - Value: `text-2xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark`
  - Description: `text-sm text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark text-center mt-2`
- **Accessibility**: Centered text for readability; high contrast between text and background in both themes.

### FilterDropdown

- **Purpose**: Provides a dropdown menu for filtering data based on categories like customer group, type, ranking, and state.
- **Props**:
  - `label`: The label for the filter (e.g., "Customer Group")
  - `name`: The key used to store the selected filter value in the store
  - `options`: An array of available filter options
- **Styling**:
  - Container: `relative inline-block w-full md:w-48 mb-4 md:mb-0 md:mr-4`
  - Button: `bg-neutral-card-background-light dark:bg-neutral-card-background-dark border border-neutral-border-light dark:border-neutral-border-dark rounded p-2 w-full text-left flex justify-between items-center shadow-sm focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none`
  - Text: `text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark`
  - Dropdown Menu: `absolute z-10 bg-neutral-card-background-light dark:bg-neutral-card-background-dark border border-neutral-border-light dark:border-neutral-border-dark rounded shadow-lg mt-1 w-full max-h-60 overflow-y-auto`
  - Menu Items: `block w-full text-left p-2 hover:bg-neutral-background-dark dark:hover:bg-neutral-background-light text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none`
- **Accessibility**: Keyboard-navigable dropdown with clear focus states using red accents; ARIA attributes can be added for screen reader support.

### DataTable

- **Purpose**: Professional-grade data table for displaying RFM customer data with enterprise-level functionality including sorting, filtering, column management, and horizontal navigation.
- **Props**:
  - `data`: An array of customer data objects to display in the table
- **Core Features**:

  - **Dual Horizontal Scrollbars**: Top and bottom horizontal scrollbars for intuitive navigation of wide tables
  - **Enhanced Sorting**: Robust type-aware sorting supporting numbers, dates, strings, and null values with clear visual indicators
  - **Column Visibility Management**: Show/hide individual columns with persistent preferences and bulk controls
  - **Drag & Drop Reordering**: Column reordering with localStorage persistence
  - **Sticky Header**: Table header remains visible during scrolling
  - **Global Search**: Real-time search across all customer data
  - **Comprehensive Segment Styling**: Visual coding for all 15 RFM segments with logical color hierarchy

- **Advanced UI Components**:

  - **Column Controls Dropdown**: Accessible dropdown with individual checkboxes for each column, "Show All" and "Hide All" bulk actions
  - **Enhanced Recency Display**: User-friendly formatting with visual category indicators (Recent, Active, Moderate, Distant, Inactive)
  - **Trend Sparklines**: Interactive 12-month purchase trend visualization with directional indicators
  - **Segment Color Coding**: Logical color progression from green (highest value) to red (highest risk) with accessibility-compliant contrast

- **Styling Architecture**:

  - **Container**: `bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-lg rounded-lg border border-neutral-border-light dark:border-neutral-border-dark overflow-hidden`
  - **Header Section**: `p-6 border-b border-neutral-border-light dark:border-neutral-border-dark` with status information and controls
  - **Top Scrollbar**: `overflow-x-auto bg-neutral-background-light dark:bg-neutral-background-dark border-b border-neutral-border-light dark:border-neutral-border-dark`
  - **Table Container**: `relative h-[calc(100vh-6rem)]` with `overflow-auto` for dual-directional scrolling
  - **Sticky Header**: `bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-md border-b-2 border-neutral-border-light dark:border-neutral-border-dark`
  - **Column Controls**: Dropdown with theme-aware styling and proper z-index management
  - **Sort Indicators**: Enhanced visual feedback with both ascending and descending arrows using red accent colors

- **Accessibility Excellence**:

  - **WCAG AA Compliance**: All color combinations meet contrast ratio requirements
  - **Keyboard Navigation**: Full keyboard support including drag-and-drop operations
  - **Screen Reader Support**: Proper ARIA labels, semantic HTML structure, and focus management
  - **Progressive Enhancement**: Core functionality works with basic interactions, enhanced with advanced features
  - **Focus Management**: Clear focus states with red accent rings for all interactive elements

- **Performance Optimizations**:

  - **Efficient Rendering**: Proper React key usage and component isolation
  - **Smart Re-renders**: Strategic use of useMemo for expensive operations
  - **LocalStorage Integration**: Persistent user preferences without performance impact
  - **Dynamic Width Calculation**: Responsive table sizing based on visible columns

- **State Management Patterns**:
  - **Local State**: Component-specific UI state (dropdown visibility, drag states)
  - **Persistent State**: Column order and visibility preferences in localStorage
  - **Shared State**: Integration with Zustand store for global data and filters
  - **Event Handling**: Proper event propagation for complex interactions

### TrendSparkline

- **Purpose**: Displays mini charts showing customer purchase trends over time with directional indicators.
- **Props**:
  - `data`: Array of trend values (e.g., monthly spend over 12 months)
  - `direction`: Trend direction ('up', 'down', or 'stable')
  - `width`: Width of the sparkline (default: 80px)
  - `height`: Height of the sparkline (default: 20px)
  - `className`: Additional CSS classes
- **Styling**:
  - Uses SVG for crisp rendering at any scale
  - Color coding: Green for upward trends (#22c55e), Red for downward trends (#ef4444), Gray for stable (#6b7280)
  - Subtle fill area under curve for visual impact
  - End point indicator dot for current status
  - Directional arrow icons with theme-aware colors
- **Accessibility**: Includes tooltip with trend direction; color coding supplemented with directional arrows for accessibility.

## Emphasis Patterns

- **Shadows**: Used for elevation and depth on cards and dropdowns (`shadow-md`, `shadow-lg`).
- **Gradients**: Not currently used, but can be added for visual interest in future iterations.
- **Hover & Focus States**:
  - Hover: Background changes for interactive elements (`hover:bg-neutral-background-dark dark:hover:bg-neutral-background-light` or `hover:bg-primary-hover-light dark:hover:bg-primary-hover-dark` for buttons).
  - Focus: Red accent rings for accessibility (`focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark`).

## Accessibility Considerations

- **Focus Outlines**: All interactive elements (buttons, dropdowns, table headers) include visible focus rings with red accents for keyboard navigation.
- **ARIA Roles**: Components like `FilterDropdown` and `DataTable` should include ARIA attributes where applicable (e.g., `aria-expanded` for dropdowns, `aria-sort` for table headers).
- **Keyboard Interactions**: Ensure all components are fully navigable via keyboard, with clear visual feedback for focus states.

## Usage Guidelines

- **Consistency**: Use these components across the dashboard to maintain a cohesive look and feel.
- **Theme Support**: Always apply theme-aware classes (`dark:`) to support both light and dark modes.
- **Red Accents**: Reserve red colors (`primary-light`, `primary-dark`) for interactive elements and critical feedback to draw user attention.
- **Refer to Style Guide**: For detailed color values, spacing, and typography rules, refer to `styleGuide.md`.
