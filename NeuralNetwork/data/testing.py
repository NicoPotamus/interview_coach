import json
import spacy
from spacy.training import offsets_to_biluo_tags

# Load your training data
with open("spacy_training_data.json", "r") as f:
    training_data = json.load(f)

nlp = spacy.blank("en")  # Use a blank spaCy model for testing

# Check each example for misaligned entities
for text, annotations in training_data:
    entities = annotations["entities"]
    biluo_tags = offsets_to_biluo_tags(nlp.make_doc(text), entities)

    if "-" in biluo_tags:
        print(f"Misaligned entity in: {text}")
        print(f"Entities: {entities}\n")