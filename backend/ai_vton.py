import sys
import os
import base64
import json
from gradio_client import Client, handle_file

def process_vton(product_image_path, user_image_path):
    try:
        # Internal log to stderr so it doesn't mess with JSON stdout
        print(f"DEBUG: Processing product {product_image_path}", file=sys.stderr)
        print(f"DEBUG: Processing user {user_image_path}", file=sys.stderr)
        
        # Initialize the client pointing to a stable IDM-VTON space
        client = Client("yisol/IDM-VTON", verbose=False)
        
        print(f"DEBUG: Client connected, sending predict...", file=sys.stderr)
        
        result = client.predict(
		dict={"background":handle_file(user_image_path),"layers":[],"composite":None},
		garm_img=handle_file(product_image_path),
		garment_des="Hello Fashion AI",
		is_checked=True,
		is_checked_crop=False,
		denoise_steps=30,
		seed=42,
		api_name="/tryon"
        )
        
        # result[0] is usually the path to the generated image
        if not result or len(result) == 0:
            raise Exception("AI returned empty result")
            
        output_image_path = result[0]
        print(f"DEBUG: Success! Result saved at {output_image_path}", file=sys.stderr)
        
        with open(output_image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            return {"success": True, "image": f"data:image/jpeg;base64,{encoded_string}"}
            
    except Exception as e:
        print(f"DEBUG: ERROR caught: {str(e)}", file=sys.stderr)
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "error": "Insufficient arguments"}))
    else:
        prod_path = sys.argv[1]
        user_path = sys.argv[2]
        res = process_vton(prod_path, user_path)
        print(json.dumps(res))
