import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from Authentication import router as auth_router
from database import init_db
from interactionengine import check_interaction
from openfdaservices import get_drug_safety, get_medicine_suggestions
from profile import router as profile_router
from rxnormservices import search_drug


app = FastAPI(
    title="Smart Medicine Safety & Drug Interaction Assistant",
    description="Real-world medicine information and safety API",
    version="1.0.0",
)


# ============================================================
# DATABASE INIT
# ============================================================

init_db()


# ============================================================
# ROUTERS
# ============================================================

app.include_router(auth_router)
app.include_router(profile_router)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "project": "Smart Medicine Safety & Drug Interaction Assistant",
        "status": "running",
        "message": "Backend API is working successfully",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {"status": "healthy"}


# ============================================================
# RXNORM MEDICINE SEARCH
# ============================================================

@app.get("/api/drug/search")
def drug_search(name: str):

    if not name.strip():
        raise HTTPException(
            status_code=400,
            detail="Medicine name is required."
        )

    try:
        result = search_drug(name)

        return {
            "success": True,
            "source": "RxNorm",
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"RxNorm API error: {e!s}"
        )


# ============================================================
# FDA SAFETY INFORMATION
# ============================================================

@app.get("/api/drug/safety")
def drug_safety(name: str):

    if not name.strip():
        raise HTTPException(
            status_code=400,
            detail="Medicine name is required."
        )

    try:
        result = get_drug_safety(name)

        return {
            "success": True,
            "source": "openFDA",
            "drug": name,
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"openFDA API error: {e!s}"
        )


# ============================================================
# DRUG INTERACTION
# ============================================================

@app.get("/api/drug/interaction")
def drug_interaction(drug1: str, drug2: str):

    if not drug1.strip() or not drug2.strip():
        raise HTTPException(
            status_code=400,
            detail="Both medicine names are required."
        )

    try:
        result = check_interaction(drug1, drug2)

        return {
            "success": True,
            "source": "openFDA + RxNorm",
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Interaction engine error: {e!s}"
        )


# ============================================================
# MEDICINE SUGGESTIONS
# ============================================================

@app.get("/api/suggest-medicines", tags=["Interaction Check"])
def suggest_medicines(
    q: str = Query(
        ...,
        min_length=2,
        description="Type medicine name prefix, e.g., 'para'"
    )
):
    """
    Autocomplete endpoint for medicine name suggestions.
    """

    results = get_medicine_suggestions(
        query=q,
        limit=7
    )

    return {
        "query": q,
        "suggestions": results
    }


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=5000,
        reload=True
    )