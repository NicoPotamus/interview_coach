import spacy
from spacy.tokens import Span
nlp = spacy.load('en_core_web_sm')
doc8 = nlp("Hands-on world-class experience with Python and Django.")
print(doc8.pos_ , "\n")