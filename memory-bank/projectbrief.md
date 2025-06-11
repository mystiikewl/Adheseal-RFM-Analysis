# Project Brief: Adheseal RFM Analysis Dashboard

## Overview

The Adheseal RFM Analysis Dashboard project aims to develop a decoupled, interactive dashboard for customer segmentation using Recency, Frequency, and Monetary (RFM) analysis. The primary goal is to provide actionable insights into customer behavior to support business decision-making and marketing strategies.

## Core Requirements

- **Decoupled Architecture**: The system will consist of a Python backend using FastAPI for data processing and RFM calculations, and a separate JavaScript frontend using React, Vite, and Tailwind CSS for an interactive user interface.
- **Backend Responsibilities**: Load data, perform RFM calculations, and expose data via a REST API. The backend will not handle data display logic.
- **Frontend Responsibilities**: Retrieve data from the backend API and render it in a user-friendly, interactive dashboard. The frontend will not perform RFM calculations.
- **Modularity and Scalability**: Ensure the system is modular, maintainable, and scalable to handle future enhancements and larger datasets.
- **User Experience**: Provide an intuitive interface with features like filters, KPI displays, and potentially advanced visualizations to facilitate easy analysis of RFM data.

## Project Goals

- Deliver a functional RFM analysis tool that helps in identifying key customer segments based on their purchasing behavior.
- Ensure data consistency and integrity through strict API contracts and validation.
- Optimize performance for quick data retrieval and visualization, even with large datasets.
- Lay the foundation for future enhancements such as caching, database integration, and advanced data visualizations.

This document serves as the foundation for all other Memory Bank files, guiding the development process and ensuring alignment with the project's core objectives.
