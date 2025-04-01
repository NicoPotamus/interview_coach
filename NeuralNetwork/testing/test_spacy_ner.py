import spacy

# Load the trained NER model
nlp = spacy.load("../trained_ner_model")

doc = nlp("We are hiring a Backend Developer with experience in Java, SQL, and AWS.")

for token in doc:
    print(f"{token.text} - POS: {token.pos_}")

print("Detected Skills:")
for ent in doc.ents:
    if ent.label_ == "SKILL":
        print(f"- {ent.text}")