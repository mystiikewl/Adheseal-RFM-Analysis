# Style Guide for Adheseal RFM Analysis Dashboard

## Overview

This style guide outlines the visual design system for the Adheseal RFM Analysis Dashboard. It ensures consistency across the user interface, providing a modern, clean, and accessible experience for users. The design supports both light and dark themes with red accents to highlight interactive elements and important information.

## Typography System

- **Font Family**: Roboto, sans-serif (default for a clean, professional look)
- **Font Sizes**:
  - Headings: `text-xl` (1.25rem) to `text-2xl` (1.5rem)
  - Body Text: `text-base` (1rem)
  - Small Text: `text-sm` (0.875rem)
- **Line Heights**: Default (1.5) for body text, tighter (1.25) for headings
- **Usage**: Headings for titles and important labels, body text for content, small text for secondary information or captions.

## Color Tokens

The color palette is designed to support both light and dark themes, with red accents for emphasis. All colors are defined in `tailwind.config.js` as CSS variables for consistency and ease of maintenance.

### Neutral Palette (Backgrounds, Cards, Text)

- **Light Theme**:
  - Background: `#F5F5F5` (neutral-background-light)
  - Card Background: `#FFFFFF` (neutral-card-background-light)
  - Border: `#E0E0E0` (neutral-border-light)
  - Text Primary: `#212121` (neutral-text-primary-light)
  - Text Secondary: `#757575` (neutral-text-secondary-light)
- **Dark Theme**:
  - Background: `#121212` (neutral-background-dark)
  - Card Background: `#1E1E1E` (neutral-card-background-dark)
  - Border: `#333333` (neutral-border-dark)
  - Text Primary: `#FFFFFF` (neutral-text-primary-dark)
  - Text Secondary: `#B3B3B3` (neutral-text-secondary-dark)

### Primary Palette (Buttons, Interactive Elements)

- **Light Theme**:
  - Primary: `#D32F2F` (primary-light) - Red for buttons and interactive elements
  - Primary Hover: `#B71C1C` (primary-hover-light)
- **Dark Theme**:
  - Primary: `#EF5350` (primary-dark) - Slightly lighter red for better contrast in dark mode
  - Primary Hover: `#D32F2F` (primary-hover-dark)

### Feedback Palette (Errors, Success, Warnings)

- **Light Theme**:
  - Error: `#B00020` (feedback-error-light)
  - Success: `#388E3C` (feedback-success-light)
  - Warning: `#F57C00` (feedback-warning-light)
- **Dark Theme**:
  - Error: `#EF5350` (feedback-error-dark)
  - Success: `#66BB6A` (feedback-success-dark)
  - Warning: `#FFA726` (feedback-warning-dark)

### RFM Segment Color Palette (Hot-to-Cold)

This palette is used for visualizing RFM segments, with colors ranging from green (highest value) to red (lowest value).

- **VIP Customers**: `#22c55e` (Green) - High-value, loyal customers
- **Customers with Potential**: `#84cc16` (Light Green) - Customers with good potential for growth
- **At Risk**: `#f59e0b` (Yellow) - Customers showing signs of churn
- **Hibernating**: `#ef4444` (Orange) - Customers who have not purchased recently
- **Other**: `#dc2626` (Red) - Lowest engagement or unclassified customers
- **Neutral/Unknown**: `#9ca3af` (Gray) - For segments not explicitly defined or unknown

### Contrast Guidance

- All text meets WCAG AA contrast ratios against backgrounds.
- Primary interactive elements (buttons, links) use red accents for clear visibility and focus indication.

## Spacing System

- **Scale**: Based on a 4px grid (0.25rem), with increments to 8px (0.5rem), 16px (1rem), 24px (1.5rem), etc.
- **CSS Variables**: Defined as `--spacing-xs` (0.25rem), `--spacing-sm` (0.5rem), `--spacing-md` (1rem), etc., in Tailwind configuration.
- **Usage**: Padding and margins use this scale for consistent spacing (e.g., `p-4` for 1rem padding, `gap-4` for 1rem spacing between grid items).

## Accessibility Notes

- **Contrast Ratios**: All text meets WCAG 2.1 Level AA standards (minimum 4.5:1 for normal text, 3:1 for large text).
- **Responsive Text Sizes**: Text scales appropriately for different screen sizes to ensure readability.
- **Focus Indicators**: Interactive elements have visible focus rings using red accents (`focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark`).
- **ARIA Roles**: Ensure components like dropdowns and tables include appropriate ARIA attributes for screen readers.
- **Keyboard Navigation**: All interactive elements are accessible via keyboard with clear focus states.

## Usage in Code

- Use Tailwind CSS classes to apply these styles (e.g., `bg-neutral-background-light dark:bg-neutral-background-dark` for theme-aware backgrounds).
- Apply the `dark` class at the root level of the application or container to enable dark mode styling (`className={`container ${theme === 'dark' ? 'dark' : ''}`}`).
- Ensure all new components follow this style guide for consistency across the dashboard.
