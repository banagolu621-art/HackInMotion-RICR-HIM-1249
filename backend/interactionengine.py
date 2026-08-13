from openfdaservices import get_drug_safety


def check_interaction(drug1: str, drug2: str):

    """
    Check interaction information between two medicines
    using real openFDA drug-label information.
    """

    drug1_data = get_drug_safety(drug1)
    drug2_data = get_drug_safety(drug2)

    if not drug1_data.get("found"):
        return {
            "status": "unknown",
            "message": f"Could not find FDA information for {drug1}.",
            "drug1": drug1,
            "drug2": drug2
        }

    if not drug2_data.get("found"):
        return {
            "status": "unknown",
            "message": f"Could not find FDA information for {drug2}.",
            "drug1": drug1,
            "drug2": drug2
        }

    interactions = []

    # Check drug 1 label for drug 2
    for label in drug1_data.get("results", []):

        interaction_text = label.get(
            "drug_interactions"
        )

        if interaction_text:

            if drug2.lower() in interaction_text.lower():

                interactions.append({
                    "source_drug": drug1,
                    "mentioned_drug": drug2,
                    "information": interaction_text
                })

    # Check drug 2 label for drug 1
    for label in drug2_data.get("results", []):

        interaction_text = label.get(
            "drug_interactions"
        )

        if interaction_text:

            if drug1.lower() in interaction_text.lower():

                interactions.append({
                    "source_drug": drug2,
                    "mentioned_drug": drug1,
                    "information": interaction_text
                })

    if interactions:

        return {
            "status": "warning",
            "message": "Potential interaction information was found in FDA labeling.",
            "drug1": drug1,
            "drug2": drug2,
            "interactions": interactions
        }

    return {
        "status": "no_direct_match_found",
        "message": (
            "No direct mention of the other medicine was found "
            "in the retrieved FDA interaction-label text. "
            "This does not prove that no interaction exists."
        ),
        "drug1": drug1,
        "drug2": drug2,
        "interactions": []
    }