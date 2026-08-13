import requests

RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST"


def search_drug(drug_name: str):
    """
    Search a medicine using the RxNorm API.
    Returns RxCUI and standardized medicine names.
    """

    url = f"{RXNORM_BASE_URL}/drugs.json"

    response = requests.get(
        url,
        params={"name": drug_name},
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    result = {
        "query": drug_name,
        "medicines": []
    }

    drug_group = data.get("drugGroup", {})
    concept_groups = drug_group.get("conceptGroup", [])

    for group in concept_groups:
        concepts = group.get("conceptProperties", [])

        for concept in concepts:
            result["medicines"].append({
                "rxcui": concept.get("rxcui"),
                "name": concept.get("name"),
                "synonym": concept.get("synonym"),
                "tty": concept.get("tty")
            })

    return result


def get_rxcui(drug_name: str):
    """
    Find the RxCUI of a medicine.
    """

    result = search_drug(drug_name)

    medicines = result.get("medicines", [])

    if not medicines:
        return None

    return medicines[0].get("rxcui")


def get_drug_name(rxcui: str):
    """
    Get standardized medicine name from RxCUI.
    """

    url = f"{RXNORM_BASE_URL}/rxcui/{rxcui}.json"

    response = requests.get(
        url,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    return data.get("idGroup", {}).get("name")