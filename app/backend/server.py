"""Tridev Jewellers — optional backend stub.

The React storefront runs fully without a backend (demo state lives in the
browser). This FastAPI app is the production seam: health checks, store info
and a file-backed inquiry inbox that the frontend can adopt later.

Runs with zero required environment variables::

    pip install -r requirements.txt
    uvicorn server:app --reload --port 8000
"""

import json
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
# pyrefly: ignore [missing-import]
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
DATA_DIR = ROOT_DIR / "data"
INBOX_FILE = DATA_DIR / "inquiries.jsonl"

STORE_INFO = {
    "name": "Tridev Jewellers",
    "street": "Golbazar-4, Siraha, Madhesh Pradesh, Nepal",
    "phone": "+977 9829770284",
    "email": "avaysoni123@gmail.com",
    "hours": "Sun - Fri, 10am - 6pm",
}

logger = logging.getLogger("tridev")


@asynccontextmanager
async def lifespan(app: FastAPI):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    logger.info("Tridev API starting (data dir: %s)", DATA_DIR)
    yield
    logger.info("Tridev API shutting down")


app = FastAPI(title="Tridev Jewellers API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InquiryIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=254)
    topic: str = Field(default="General enquiry", max_length=120)
    message: str = Field(default="", max_length=5000)


class Inquiry(InquiryIn):
    id: str
    date: str
    read: bool = False


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "tridev-jewellers-api",
        "time": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/store")
def store_info():
    return STORE_INFO


@app.post("/api/inquiries", status_code=201)
def create_inquiry(payload: InquiryIn):
    if "@" not in payload.email:
        raise HTTPException(status_code=422, detail="A valid email address is required.")
    record = Inquiry(
        id=f"INQ-{datetime.now(timezone.utc).strftime('%y%m%d%H%M%S')}",
        date=datetime.now(timezone.utc).date().isoformat(),
        **payload.model_dump(),
    )
    with INBOX_FILE.open("a", encoding="utf-8") as fh:
        fh.write(record.model_dump_json() + "\n")
    return record


@app.get("/api/inquiries")
def list_inquiries():
    if not INBOX_FILE.exists():
        return []
    items = []
    with INBOX_FILE.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                items.append(json.loads(line))
    return items
