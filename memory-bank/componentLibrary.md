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

- **Purpose**: Displays a sortable, searchable table of customer data with export functionality for CSV.
- **Props**:
  - `data`: An array of customer data objects to display in the table
- **Styling**:
  - Container: `bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-md rounded-lg p-4 mt-6`
  - Header: `bg-neutral-background-light dark:bg-neutral-background-dark`
  - Table Cells: `text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark`
  - Search Input: `border border-neutral-border-light dark:border-neutral-border-dark rounded p-2 w-full md:w-48 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none bg-neutral-background-light dark:bg-neutral-background-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark`
  - Export Button: `bg-primary-light dark:bg-primary-dark hover:bg-primary-hover-light dark:hover:bg-primary-hover-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark font-semibold p-2 rounded focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none`
  - Hover States: Rows and interactive elements use `hover:bg-neutral-background-dark dark:hover:bg-neutral-background-light` for visual feedback.
- **Accessibility**: Table headers are clickable for sorting with visual indicators (arrows); search input and export button have clear focus states with red accents.

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
