import spacy
from spacy.tokens import Span
nlp = spacy.load('en_core_web_sm')
doc8 = nlp("Hands/on world-class experience with Python and Django.")
print(len(doc8))
for token in doc8:
    print(token.text, token.pos_)