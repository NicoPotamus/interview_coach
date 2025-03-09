import spacy

# Load models
best_model = spacy.load("../models/trained_ner_model_best")
regular_model = spacy.load("../models/trained_ner_model")

text = "The ideal candidate should have expertise in Java, Spring Boot, and AWS."


def extract_skills(nlp, text, model_name):
    doc = nlp(text)
    print(f"\n Detected Skills from {model_name}:")
    
    for ent in doc.ents:
        if ent.label_ == "SKILL":
            # Approximate confidence estimation using token probabilities
            token_probs = [token.prob for token in ent]
            avg_confidence = sum(token_probs) / len(token_probs) if token_probs else "N/A"
            print(f"- {ent.text} (Confidence: {avg_confidence})")

print("\n--- Best Model ---")
extract_skills(best_model, text, "Best Model")

print("\n--- Regular Model ---")
extract_skills(regular_model, text, "Regular Model")