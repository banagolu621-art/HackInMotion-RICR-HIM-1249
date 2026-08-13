from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from rxnormservices import search_drug
from openfdaservices import get_drug_safety
from interactionengine import check_interaction


app = FastAPI(
    title="Smart Medicine Safety & Drug Interaction Assistant",
    description="Real-world medicine information and safety API",
    version="1.0.0"
)


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
        "message": "Backend API is working successfully"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


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
            detail=f"RxNorm API error: {str(e)}"
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
            detail=f"openFDA API error: {str(e)}"
        )


# ============================================================
# DRUG INTERACTION
# ============================================================

@app.get("/api/drug/interaction")
def drug_interaction(
    drug1: str,
    drug2: str
):

    if not drug1.strip() or not drug2.strip():

        raise HTTPException(
            status_code=400,
            detail="Both medicine names are required."
        )

    try:

        result = check_interaction(
            drug1,
            drug2
        )

        return {
            "success": True,
            "source": "openFDA + RxNorm",
            "data": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Interaction engine error: {str(e)}"
        )