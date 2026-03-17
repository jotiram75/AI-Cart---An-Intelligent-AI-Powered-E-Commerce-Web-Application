from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse
import uvicorn
import shutil
import os
from model import FeatureExtractor
from vector_db import VectorDB
import tempfile
import base64
from gradio_client import Client, handle_file
from dotenv import load_dotenv
import os

# Load environment variables from backend directory
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)


app = FastAPI()
extractor = FeatureExtractor()
db = VectorDB()

# Initialize VTON client once at startup
try:
    hf_token = os.getenv("HUGGINGFACE_API_KEY")
    vton_client = Client("yisol/IDM-VTON", token=hf_token, verbose=False)
    print("VTON Client initialized successfully")
except Exception as e:
    print(f"Warning: VTON Client failed to initialize: {e}")
    vton_client = None

def resize_image(input_path, output_path, max_size=(768, 1024)):
    from PIL import Image
    with Image.open(input_path) as img:
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        img.save(output_path, "JPEG", quality=85)

@app.get("/health")
def health_check():
    return {"status": "healthy", "index_size": len(db.id_map)}

@app.post("/index")
async def index_product(product_id: str, file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        
        features = extractor.extract(tmp_path)
        db.add_vectors([features], [product_id])
        
        os.unlink(tmp_path)
        return {"success": True, "message": f"Product {product_id} indexed"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@app.post("/search")
async def search_similar(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
            
        features = extractor.extract(tmp_path)
        results = db.search(features, top_k=10)
        
        os.unlink(tmp_path)
        return {"success": True, "results": results}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@app.post("/clear")
def clear_index():
    db.clear()
    return {"success": True, "message": "Index cleared"}

@app.post("/try-outfit")
async def try_outfit(user_image: UploadFile = File(...), product_image: UploadFile = File(...)):
    try:
        # Save user image to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_user:
            shutil.copyfileobj(user_image.file, tmp_user)
            user_path = tmp_user.name
        
        # Save product image to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_prod:
            shutil.copyfileobj(product_image.file, tmp_prod)
            prod_path = tmp_prod.name

        # Call IDM-VTON via Gradio Client (as seen in ai_vton.py)
        global vton_client
        if vton_client is None:
            hf_token = os.getenv("HUGGINGFACE_API_KEY")
            vton_client = Client("yisol/IDM-VTON", token=hf_token, verbose=False)
            
        res_user = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        res_user.close()
        resize_image(user_path, res_user.name)
        opt_user_path = res_user.name
            
        res_prod = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        res_prod.close()
        resize_image(prod_path, res_prod.name)
        opt_prod_path = res_prod.name

        result = vton_client.predict(
            dict={"background": handle_file(opt_user_path), "layers": [], "composite": None},
            garm_img=handle_file(opt_prod_path),
            garment_des="Hello Fashion AI",
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )

        if not result or len(result) == 0:
            raise Exception("AI returned empty result")
            
        output_image_path = result[0]
        
        with open(output_image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Cleanup
        os.unlink(user_path)
        os.unlink(prod_path)
        os.unlink(opt_user_path)
        os.unlink(opt_prod_path)
        # Usually we don't need to unlink output_image_path as it's in a temp dir managed by gradio
        
        return {"success": True, "image": f"data:image/jpeg;base64,{encoded_string}"}
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR in /try-outfit: {error_details}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e), "details": error_details})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
