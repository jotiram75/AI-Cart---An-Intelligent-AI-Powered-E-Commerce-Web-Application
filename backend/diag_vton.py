import sys
import os
import json
try:
    from gradio_client import Client, handle_file
    print(json.dumps({"success": True, "message": "gradio_client is installed"}))
except ImportError:
    print(json.dumps({"success": False, "error": "gradio_client NOT installed. Run: pip install gradio_client"}))
    sys.exit(1)

try:
    client = Client("yisol/IDM-VTON")
    print(json.dumps({"success": True, "message": "IDM-VTON Client connected"}))
    api_info = client.view_api(all_endpoints=True)
    # The view_api call is huge, let's just confirm connection for now
except Exception as e:
    print(json.dumps({"success": False, "error": f"IDM-VTON Connection failed: {str(e)}"}))
