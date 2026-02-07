"""
Test Script for Velosify Study Copilot Backend
Run this to verify your backend is working correctly
"""
import requests
import json
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8000"
TEST_USER_ID = "test_user_123"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health_check():
    print_section("1. Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_upload_document():
    print_section("2. Document Upload")
    
    # Create a simple test PDF (you'll need to have a real PDF file)
    pdf_path = Path("test_document.pdf")
    
    if not pdf_path.exists():
        print("⚠️  No test PDF found. Please create 'test_document.pdf' in the backend directory.")
        print("   You can use any PDF file for testing.")
        return None
    
    try:
        with open(pdf_path, 'rb') as f:
            files = {'file': ('test_document.pdf', f, 'application/pdf')}
            data = {
                'user_id': TEST_USER_ID,
                'subject': 'Test Subject',
                'topic': 'Test Topic'
            }
            
            response = requests.post(f"{BASE_URL}/api/upload", files=files, data=data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                return response.json().get('document_id')
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_list_documents():
    print_section("3. List Documents")
    try:
        response = requests.get(f"{BASE_URL}/api/documents/{TEST_USER_ID}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chat(document_id=None):
    print_section("4. RAG Chat")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "query": "What is this document about?",
            "document_ids": [document_id] if document_id else None,
            "max_results": 5
        }
        
        response = requests.post(
            f"{BASE_URL}/api/chat",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(payload)
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_notes_generation(document_id=None):
    print_section("5. Notes Generation")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "document_ids": [document_id] if document_id else [],
            "topic": "Main Concepts",
            "include_examples": True,
            "include_highlights": True
        }
        
        if not document_id:
            print("⚠️  Skipping - no document uploaded")
            return False
        
        response = requests.post(
            f"{BASE_URL}/api/notes/generate",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(payload)
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_quiz_generation(document_id=None):
    print_section("6. Quiz Generation")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "document_ids": [document_id] if document_id else [],
            "num_questions": 5,
            "difficulty": "medium",
            "topic": None
        }
        
        if not document_id:
            print("⚠️  Skipping - no document uploaded")
            return False
        
        response = requests.post(
            f"{BASE_URL}/api/quiz/generate",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(payload)
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_study_planner(document_id=None):
    print_section("7. Study Planner")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "exam_date": "2026-03-01",
            "available_hours_per_day": 3.0,
            "weak_topics": ["Topic A", "Topic B"],
            "document_ids": [document_id] if document_id else None
        }
        
        response = requests.post(
            f"{BASE_URL}/api/planner/generate",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(payload)
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def run_all_tests():
    print("\n" + "🚀 "*20)
    print("  VELOSIFY STUDY COPILOT - BACKEND TEST SUITE")
    print("🚀 "*20)
    
    results = {}
    
    # Test 1: Health Check
    results['health'] = test_health_check()
    
    if not results['health']:
        print("\n❌ Backend is not running or not accessible!")
        print("   Make sure to start the backend with: python main.py")
        return
    
    # Test 2: Upload Document
    document_id = test_upload_document()
    results['upload'] = document_id is not None
    
    # Test 3: List Documents
    results['list'] = test_list_documents()
    
    # Test 4: Chat
    results['chat'] = test_chat(document_id)
    
    # Test 5: Notes Generation
    results['notes'] = test_notes_generation(document_id)
    
    # Test 6: Quiz Generation
    results['quiz'] = test_quiz_generation(document_id)
    
    # Test 7: Study Planner
    results['planner'] = test_study_planner(document_id)
    
    # Summary
    print_section("TEST SUMMARY")
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    for test_name, passed_test in results.items():
        status = "✅ PASS" if passed_test else "❌ FAIL"
        print(f"{status} - {test_name.upper()}")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your backend is working perfectly!")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    run_all_tests()
