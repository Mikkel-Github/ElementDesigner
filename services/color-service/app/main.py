from typing import Optional

from color_utils import Color, create_color_object, get_related_colors
from data_loader import load_colors_from_json
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
# React local dev server
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
]
# Allows CORS from these origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # (GET, POST, and everything else)
    allow_headers=["*"],
)

# Load the color json file into memory
colors_dataset: list[Color] = []


@app.on_event("startup")
def load_colors():
    global colors_dataset
    colors_dataset = load_colors_from_json("./app/colors.json")


# API endpoints
@app.get("/")
def read_root():
    return {"status": "ok"}


@app.get("/colors")
def get_all_colors():
    return colors_dataset


@app.get("/color/rgb")
def related_colors(
    hex: Optional[str] = None,
    r: Optional[int] = Query(int, ge=0, le=255),
    g: Optional[int] = Query(None, ge=0, le=255),
    b: Optional[int] = Query(None, ge=0, le=255),
    h: Optional[float] = Query(None, ge=0.0, le=360.0),
    s: Optional[float] = Query(None, ge=0.0, le=100.0),
    l: Optional[float] = Query(None, ge=0.0, le=100.0),
    count: int = Query(5, ge=1, le=50),
):
    try:
        target_color = None

        if hex:
            target_color = create_color_object(hex_color=hex)
        elif r is not None and g is not None and b is not None:
            target_color = create_color_object(rgb_color=(r, g, b))
        elif h is not None and s is not None and l is not None:
            target_color = create_color_object(hsl_color=(h, s, l))
        else:
            raise ValueError(
                "You must provide either hex, rgb (r, g, b), or hsl (h, s, l)"
            )

        related = get_related_colors(target_color, colors_dataset, num_related=count)
        return [c.to_dict() for c in related]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
