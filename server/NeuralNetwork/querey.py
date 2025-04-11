### Implementation of the inputting 1 description
import spacy

# Load the trained NER model
nlp = spacy.load("./NeuralNetwork/models/trained_ner_model_best")

def NER_description(description):
    doc = nlp(description)
    output = []
    for ent in doc.ents:
        if ent.label_ == "SKILL":
            output.append(ent.text)
    return output
