
print("Testing startup...")
import sys
print("Importing settings...")
from config import settings
print("Importing PDFProcessor...")
from pdf_processor import PDFProcessor
print("Importing VectorStore...")
from vector_store import VectorStore
print("Importing RAGEngine...")
from rag_engine import RAGEngine
print("Importing AIServices...")
from ai_services import AIServices

print("Initializing PDFProcessor...")
pdf = PDFProcessor()
print("Initializing VectorStore...")
vs = VectorStore()
print("Initializing RAGEngine...")
rag = RAGEngine()
print("Initializing AIServices...")
ai = AIServices()
print("Startup test complete!")
