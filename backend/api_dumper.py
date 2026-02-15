from gradio_client import Client
import io
from contextlib import redirect_stdout

client = Client("yisol/IDM-VTON")
f = io.StringIO()
with redirect_stdout(f):
    client.view_api(all_endpoints=True)
out = f.getvalue()

with open(r'C:\Users\shind\Downloads\Personal_Repo_Project\AICart\backend\api_spec.txt', 'w', encoding='utf-8') as spec_file:
    spec_file.write(out)

print("API Spec dumped successfully.")
