"""
Configuration module for Velosify Study Copilot
Handles environment variables and application settings
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Application settings and configuration"""
    
    # API Keys
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Storage Configuration
    BASE_DIR: Path = Path(__file__).parent
    UPLOAD_DIR: Path = BASE_DIR / os.getenv("UPLOAD_DIR", "uploads")
    VECTOR_STORE_DIR: Path = BASE_DIR / os.getenv("VECTOR_STORE_DIR", "vector_stores")
    
    # File Upload Limits
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
    MAX_FILE_SIZE_BYTES: int = MAX_FILE_SIZE_MB * 1024 * 1024
    ALLOWED_EXTENSIONS: set = {"pdf"}
    
    # RAG Configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RESULTS: int = 5
    SIMILARITY_THRESHOLD: float = 0.7
    
    # LLM Configuration
    MODEL_NAME: str = "gemini-pro"
    EMBEDDING_MODEL: str = "models/embedding-001"
    TEMPERATURE: float = 0.3
    MAX_OUTPUT_TOKENS: int = 2048
    
    def __init__(self):
        """Create necessary directories on initialization"""
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        self.VECTOR_STORE_DIR.mkdir(parents=True, exist_ok=True)
    
    def validate(self) -> bool:
        """Validate that required settings are present"""
        if not self.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is required")
        if not self.SUPABASE_URL or not self.SUPABASE_KEY:
            raise ValueError("Supabase credentials are required")
        return True

# Global settings instance
settings = Settings()
