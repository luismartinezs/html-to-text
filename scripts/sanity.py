#!/usr/bin/env python3
"""
Sanity check script to verify virtual environment is properly configured
and can import third-party libraries correctly.
"""

import sys
from datetime import datetime


def test_library_import(library_name, import_statement, test_function):
    """Test if a library can be imported and used."""
    try:
        print(f"Testing {library_name}...")
        exec(import_statement)
        result = test_function()
        print(f"✓ {library_name}: {result}")
        return True
    except ImportError as e:
        print(f"✗ {library_name}: Import failed - {e}")
        return False
    except Exception as e:
        print(f"✗ {library_name}: Runtime error - {e}")
        return False


def test_numpy():
    """Test numpy functionality."""
    import numpy as np
    arr = np.array([1, 2, 3, 4, 5])
    mean_val = np.mean(arr)
    return f"Created array {arr.tolist()}, mean = {mean_val}"


def test_requests():
    """Test requests functionality."""
    import requests
    response = requests.get('https://httpbin.org/status/200', timeout=5)
    return f"HTTP request successful, status: {response.status_code}"


def main():
    print("=" * 50)
    print("Virtual Environment Library Import Test")
    print("=" * 50)
    print(f"Python executable: {sys.executable}")
    print(f"Python version: {sys.version}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("-" * 50)
    
    tests = [
        ("NumPy", "import numpy as np", test_numpy),
        ("Requests", "import requests", test_requests)
    ]
    
    passed = 0
    total = len(tests)
    
    for library_name, import_stmt, test_func in tests:
        if test_library_import(library_name, import_stmt, test_func):
            passed += 1
        print()
    
    print("-" * 50)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ Virtual environment is properly configured!")
        return True
    else:
        print("✗ Some libraries failed to import or function correctly")
        print("Make sure to install required packages: pip install numpy requests")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)