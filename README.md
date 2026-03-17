# AICart - AI Powered E-Commerce Application

AICart is a modern, AI-powered e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It includes an admin panel, user authentication, and a customer-facing storefront.

## Key Features

### Advanced Storefront
- **Modern UI/UX**: Responsive design with product filtering, search, and a premium product detail page.
- **Voice Assistant**: Hands-free navigation and product search powered by speech recognition.
- **AI Chatbot**: Intelligent assistant powered by Google Gemini.
  - **Global Context**: Answers general queries (return policy, contact info).
  - **Product Context**: Product-specific insights while viewing a product.
  - **Smart Caching**: Database caching for instant responses to common queries.

### AI Shopping Features
- **AI Virtual Try-On (VTO)**: Upload a photo of yourself and a garment to generate high-quality photos of yourself wearing the garment.
  - **FastAPI Microservice**: Handles complex generative model processing.
  - **Model Integration**: Powered by models like Gemini, Replicate, and Imagen (with fallbacks such as Flux Schnell, SDXL, and SDXL-Turbo for robust performance).
  - **Storage**: Optimized image storage on Cloudinary.
- **AI Visual Search**: Upload an image and find visually similar products (captioning + embeddings).
- **AI Size Finder**: KNN-based size recommendation using height/weight/body type and available sizes.
- **AI Review Insights (Sentiment + Fake Review Detection)**:
  - Positive/Negative/Neutral sentiment classification (HuggingFace by default, local fallback).
  - Suspicious/fake review heuristics (duplicate similarity + patterns like incentives / repetition).
  - Pros/cons extraction from mixed statements (e.g. "Battery life is poor but camera is excellent").
  - Optional short review summary (HuggingFace summarization model, best-effort).

### Secure & Scalable Backend
- **Authentication**: Firebase (Google Login) + JWT (Email/Password flow where applicable).
- **Database**: MongoDB Atlas.
- **Payments**: Razorpay integration.
- **Image Intelligence**: Cloudinary for optimized image storage and delivery.

### Comprehensive Admin Panel
- **Dashboard**: Statistics, sales charts, and order tracking.
- **Product Management**: CRUD with image uploads.
- **Order Management**: Track and update order statuses.

## Project Structure

```text
AICart/
|-- admin/                # Admin Dashboard (Vite + React)
|   `-- src/
|       |-- component/
|       |-- context/
|       |-- pages/
|       `-- App.jsx
|-- backend/              # Node.js/Express API Server
|   |-- config/
|   |-- controller/
|   |-- middleware/
|   |-- model/            # includes Review model
|   |-- routes/           # includes /api/ai and /api/review
|   `-- index.js
`-- frontend/             # Customer-Facing Application (Vite + React)
    `-- src/
        |-- component/
        |-- context/
        |-- pages/
        `-- App.jsx
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB account (for database)
- Cloudinary account (for image storage)
- Razorpay account (for payments)
- Hugging Face token (optional: sentiment + summarization)
- Google Gemini API key (optional: chatbot + visual search captioning)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AICart
   ```

2. **Install dependencies:**
   - **Backend**
     ```bash
     cd backend
     npm install
     ```
   - **Frontend**
     ```bash
     cd ../frontend
     npm install
     ```
   - **Admin**
     ```bash
     cd ../admin
     npm install
     ```

### Configuration (.env)

**Backend (`backend/.env`):**
```env
PORT=8000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@aicart.com
ADMIN_PASSWORD=admin1234567
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_KEY_ID=your_razorpay_id

# AI (optional but recommended for full features)
HUGGINGFACE_API_KEY=your_hf_token
GEMINI_API_KEY=your_gemini_key

# Optional model overrides
REVIEW_SENTIMENT_MODEL_ID=distilbert-base-uncased-finetuned-sst-2-english
REVIEW_SUMMARY_MODEL_ID=sshleifer/distilbart-cnn-12-6
VISUAL_SEARCH_MODEL_ID=local-hash-v1
```

**Frontend (`frontend/.env`):**
```env
VITE_FIREBASE_APIKEY=your_firebase_key
VITE_RAZORPAY_KEY_ID=your_razorpay_id
VITE_SERVER_URL=http://localhost:8000
VITE_ADMIN_URL=http://localhost:5174
```

**Admin (`admin/.env`):**
```env
VITE_SERVER_URL=http://localhost:8000
```

## API (Selected)

### AI (General)
- `POST /api/ai/chat` -> Gemini-powered assistant (text)
- `GET /api/ai/suggest-questions` -> suggested prompts for the voice assistant UI
- `POST /api/ai/try-on` -> AI try-on / preview generation (if enabled and keys available)
- `POST /api/ai/size-recommend` -> AI Size Finder (KNN)
- `POST /api/ai/visual-search` (multipart `image`) -> AI Visual Search
- `POST /api/ai/visual-search/reindex` -> re-generate product embeddings (admin/superadmin in production)

### Reviews
- `GET /api/review/:productId?limit=20&includeSummary=false` -> list reviews + aggregated insights
- `POST /api/review/:productId` (auth cookie required) -> create review (auto sentiment/pros/cons/fake scoring)

### AI Review Sentiment Analyzer (on-demand)
- `POST /api/ai/reviews/analyze`
  - Body example:
    ```json
    {
      "includeSummary": true,
      "reviews": ["Battery life is poor but camera is excellent"]
    }
    ```
  - Returns per-review sentiment + extracted pros/cons + suspicious indicators + optional summary text.
  - Note: If HuggingFace is unavailable (e.g., HTTP 410/429/503), the API falls back to a local heuristic instead of failing the request.

## AI Features (Deep Dive)

This project keeps the AI features practical and production-friendly:
- Prefer deterministic algorithms where possible (KNN, cosine similarity, heuristics).
- Use external model APIs (Gemini / HuggingFace) as best-effort and fall back gracefully when unavailable.

### 1) AI Virtual Try-On (VTO)

**What it does**
- Allows users to upload a photo of themselves and select a garment to see how it looks on them.

**Algorithm / model**
- Integrates with external APIs (Replicate, Imagen, Google Gemini).
- Provides fallback to alternative models (Flux Schnell, SDXL, and SDXL-Turbo) in case of model unavailability.

**Where it is implemented**
- Python Backend Microservice: `backend/ai_vton.py` and `backend/ai_service/main.py`
- Node Backend: Controller and route integration.
- Frontend UI: `frontend/src/component/VirtualTryOn.jsx`

**How it works (high level)**
1. User uploads an image and selects a clothing item on the frontend.
2. Frontend sends the image and metadata to the Node.js backend (`POST /api/ai/try-on`).
3. Node backend forwards the request to the Python FastAPI microservice.
4. FastAPI microservice invokes the generative model, returning the generated image.
5. Node backend saves the result URL (often via Cloudinary) and returns it to the frontend for display.

### 1) AI Chatbot (Gemini)

**What it does**
- Answers questions about the shop and (in product context) can answer product-specific queries.

**Algorithm / model**
- LLM text generation via Google Gemini.
- Backend tries a small fallback list of Gemini model IDs to reduce downtime during model availability issues.

**Where it is implemented**
- Backend: `backend/controller/aiController.js`
- Frontend UI: `frontend/src/component/ChatBot.jsx` and `frontend/src/component/Ai.jsx`

**How it works (high level)**
1. Frontend sends the user message to `POST /api/ai/chat`.
2. Backend builds a prompt (and may add cached context) and requests Gemini output.
3. Response is returned to the UI; voice assistant can also speak it via `speechSynthesis`.

### 2) Voice Assistant (Hands-free navigation + search)

**What it does**
- Listens for voice commands like "home", "open cart", "show me shirts".
- Routes commands to navigation, search, or AI chat as a fallback.

**Algorithm**
- Browser SpeechRecognition (Web Speech API) for speech-to-text.
- Simple rule-based intent router (keyword matching) for navigation/search.
- Fallback to AI chat for free-form queries.

**Where it is implemented**
- Frontend: `frontend/src/component/Ai.jsx`

**How it works (high level)**
1. Browser converts speech to text (`SpeechRecognition`).
2. The transcript is matched against known navigation/search keywords.
3. If it doesn't match, it calls `POST /api/ai/chat` and speaks the answer.

### 3) AI Visual Search (Image -> caption -> embedding -> cosine similarity)

**What it does**
- Upload an image and get visually similar products.

**Algorithm**
- Step A: **Image captioning** using Gemini (the caption describes type/color/material/style).
- Step B: **Text embedding (local hashed embedding)** from the caption:
  - Tokenize text.
  - Hash tokens (FNV-1a) into a fixed-size vector (default 512).
  - Add lightweight bigram features for more specificity.
  - L2-normalize the vector.
- Step C: **Retrieval** using cosine similarity (dot product on normalized vectors).

**Why this approach**
- You avoid storing heavy ML models in your backend runtime.
- Vector search is deterministic and fast for small/medium catalogs.
- Captioning provides semantic cues even when product photos differ in angle/background.

**Where it is implemented**
- Product embedding generation: `backend/services/visualEmbeddingService.js`
- Search + reindex endpoints: `backend/controller/visualSearchController.js`
- Product schema fields: `backend/model/productModel.js` (`visualEmbedding*` fields)
- Frontend UI: `frontend/src/pages/VisualSearch.jsx`

**Manual setup / usage**
1. Make sure products have embeddings:
   - New products attempt to get an embedding on create (best-effort).
   - Or run `POST /api/ai/visual-search/reindex` to generate embeddings for existing products.
2. Call `POST /api/ai/visual-search` with `multipart/form-data` and file field `image`.
3. Backend returns ranked products with similarity scores and the generated caption.

### 4) AI Size Finder (KNN with weighted voting)

**What it does**
- Suggests a clothing size based on height, weight, body type, fit preference, and available sizes.

**Algorithm**
- K-Nearest Neighbors (KNN) classification using a small curated dataset.
- Features are normalized to comparable ranges: `[heightCm/200, weightKg/150, bodyTypeIndex/3]`.
- Distance metric: Euclidean distance.
- Voting: inverse-distance weighted voting for confidence.
- Fit adjustment:
  - `slim` shifts 1 size down, `loose` shifts 1 size up, `regular` keeps predicted size.
  - If the predicted size isn't available, pick the nearest available alpha size.

**Where it is implemented**
- Backend: `backend/services/sizeRecommendationService.js`
- Endpoint: `POST /api/ai/size-recommend` in `backend/routes/aiRoutes.js`

**Manual setup / usage**
1. Send a body like:
   ```json
   {
     "gender": "women",
     "garmentType": "topwear",
     "heightCm": 165,
     "weightKg": 60,
     "bodyType": "average",
     "fitPreference": "regular",
     "availableSizes": ["S", "M", "L"]
   }
   ```
2. Backend returns recommended size + confidence + alternatives.

### 5) AI Review Insights (Sentiment + fake review detection + pros/cons + summary)

**What it does**
- Classifies reviews as Positive/Negative/Neutral.
- Flags suspicious reviews (heuristics + duplicate similarity).
- Extracts pros/cons from mixed statements.
- Optionally generates a short summary across reviews (best-effort).

**Algorithms**
- **Sentiment (HuggingFace)**:
  - Default model: `distilbert-base-uncased-finetuned-sst-2-english`
  - Provider: HuggingFace Inference API
  - Fallback: local lexicon heuristic (so the API still works even if HF returns 410/429/503)
- **Pros/cons extraction**:
  - Split a review into clauses (sentences + contrast markers like "but/however").
  - Run sentiment on each clause.
  - Top positive clauses -> pros, top negative clauses -> cons.
- **Suspicious/fake review heuristics**:
  - Excessive punctuation / ALL-CAPS, very short or unusually long reviews, incentive keywords.
  - Repetition ratio (same word repeated too much).
  - Duplicate similarity using Jaccard similarity on token sets; high similarity bumps suspicion score.
- **Summary (optional, best-effort)**:
  - Default model: `sshleifer/distilbart-cnn-12-6`

**Where it is implemented**
- Analysis engine: `backend/services/reviewAnalysisService.js`
- Persisted reviews + insights: `backend/controller/reviewController.js`, `backend/routes/reviewRoutes.js`, `backend/model/reviewModel.js`
- On-demand analyzer: `backend/controller/reviewAnalysisController.js` via `POST /api/ai/reviews/analyze`
- Frontend UI: `frontend/src/component/ReviewInsights.jsx`, `frontend/src/utils/reviewService.js`

**How the example works**
- Input: "Battery life is poor but camera is excellent"
- Clause split:
  - "Battery life is poor" -> Negative -> goes to Cons
  - "camera is excellent" -> Positive -> goes to Pros

## Manual Implementation Guide (How to build these AI features yourself)

If you want to recreate/extend the AI modules from scratch, follow this pattern (Backend -> Frontend).

### Backend pattern (recommended)
1. **Create a service** that implements the algorithm/model calls:
   - Example: `backend/services/reviewAnalysisService.js`, `backend/services/sizeRecommendationService.js`
2. **Create a controller** that validates input and calls the service:
   - Example: `backend/controller/reviewController.js`, `backend/controller/sizeRecommendationController.js`
3. **Add routes** under `/api/ai` for AI utilities or `/api/<domain>` for persisted resources:
   - Example: `backend/routes/aiRoutes.js`, `backend/routes/reviewRoutes.js`
4. **Add schema fields / models** if you need persistence:
   - Example: `backend/model/productModel.js` (visual embeddings), `backend/model/reviewModel.js` (review + analysis)
5. **Make external model calls best-effort**:
   - Wrap HuggingFace/Gemini calls in `try/catch` and provide a deterministic fallback.

### Frontend pattern (recommended)
1. **Create an API wrapper** in `frontend/src/utils/`:
   - Example: `frontend/src/utils/reviewService.js`
2. **Create a UI component** that loads data, triggers analysis, and renders insights:
   - Example: `frontend/src/component/ReviewInsights.jsx`
3. **Mount it in the relevant page**:
   - Example: `frontend/src/pages/ProductDetail.jsx`
4. **Keep UX resilient**:
   - Show fallback text if AI summary is unavailable.
   - Never block core commerce flows (cart/order) on AI success.

## Running the Application

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
2. **Start Admin Panel**
   ```bash
   cd admin
   npm run dev
   ```
3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## Deployment

This project is optimized for deployment on Vercel.

1. **Backend**: Deploy the `backend` directory and set environment variables.
2. **Frontend**: Deploy the `frontend` directory and set `VITE_SERVER_URL` to the deployed backend URL.
3. **Admin**: Deploy the `admin` directory and set `VITE_SERVER_URL` to the deployed backend URL.
