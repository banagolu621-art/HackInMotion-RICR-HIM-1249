import os
import requests
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

FDA_BASE_URL = "https://api.fda.gov/drug/label.json"


def get_drug_safety(drug_name: str):
    """
    Fetch real drug safety information from the openFDA
    Drug Product Labeling API.
    """

    search_query = (
        f'openfda.generic_name:"{drug_name}"'
        f' OR '
        f'openfda.brand_name:"{drug_name}"'
    )

    params = {
        "search": search_query,
        "limit": 5
    }

    api_key = os.getenv("OPENFDA_API_KEY")

    if api_key:
        params["api_key"] = api_key

    response = requests.get(
        FDA_BASE_URL,
        params=params,
        timeout=20
    )

    # Drug not found
    if response.status_code == 404:
        return {
            "found": False,
            "message": "No FDA drug label found for this medicine."
        }

    response.raise_for_status()

    data = response.json()

    results = data.get("results", [])

    if not results:
        return {
            "found": False,
            "message": "No FDA drug label found."
        }

    formatted_results = []

    for drug in results:

        openfda = drug.get("openfda", {})

        formatted_results.append({
            "brand_name": get_first(openfda.get("brand_name")),
            "generic_name": get_first(openfda.get("generic_name")),
            "manufacturer": get_first(openfda.get("manufacturer_name")),

            "indications": get_first(
                drug.get("indications_and_usage")
            ),

            "warnings": get_first(
                drug.get("warnings")
            ),

            "boxed_warning": get_first(
                drug.get("boxed_warning")
            ),

            "contraindications": get_first(
                drug.get("contraindications")
            ),

            "adverse_reactions": get_first(
                drug.get("adverse_reactions")
            ),

            "drug_interactions": get_first(
                drug.get("drug_interactions")
            ),

            "pregnancy": get_first(
                drug.get("pregnancy")
            ),

            "dosage": get_first(
                drug.get("dosage_and_administration")
            )
        })

    return {
        "found": True,
        "count": len(formatted_results),
        "results": formatted_results
    }


def get_first(value):
    """
    openFDA fields are usually arrays.
    This function safely returns the first value.
    """

    if isinstance(value, list):

        if len(value) == 0:
            return None

        return value[0]

    return value


def get_medicine_suggestions(query: str, limit: int = 5):
    """
    Search openFDA for drug brand names matching the search query.
    Example: query="para" -> returns ["PARACETAMOL", "PARACETAMOL EXTRA", ...]
    """
    if not query or len(query.strip()) < 2:
        return []

    # Wildcard search using *
    search_term = query.strip().lower()
    url = f"https://api.fda.gov/drug/label.json?search=openfda.brand_name:{search_term}*+openfda.generic_name:{search_term}*&limit={limit}"

    try:
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            return []
            
        data = response.json()
        suggestions = set()

        if "results" in data:
            for item in data["results"]:
                openfda = item.get("openfda", {})
                
                # Brand names collect karein
                for brand in openfda.get("brand_name", []):
                    if search_term in brand.lower():
                        suggestions.add(brand.title())
                        
                # Generic names collect karein
                for generic in openfda.get("generic_name", []):
                    if search_term in generic.lower():
                        suggestions.add(generic.title())

        return list(suggestions)[:limit]

    except Exception as e:
        print(f"Error fetching suggestions: {e}")
        return []