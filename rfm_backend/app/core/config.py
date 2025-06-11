from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

# Base directory for the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Data file paths
DATA_DIR = BASE_DIR / "data"
CUSTOMER_DATA_PATH = DATA_DIR / "customer_data.csv"
SALES_DATA_PATH = DATA_DIR / "sales_data.csv"

# API settings
API_TITLE = "Adheseal RFM Analysis API"
API_DESCRIPTION = "API for RFM Analysis Dashboard"
API_VERSION = "1.0.0"

# CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
