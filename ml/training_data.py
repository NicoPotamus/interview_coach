#make a list of texts from the CSV file
import spacy
from spacy.tokens import Span
import csv

TEXTS = []
with open("./related_skills.csv", mode='r') as f:
    reader = csv.reader(f, delimiter=',')
    next(reader)  # Skip the first row
    for row in reader:
        TEXTS.extend(row)

# Load the spaCy model use the following command to download the model
# python -m spacy download en_core_web_lg
nlp = spacy.load("en_core_web_lg")
docs = nlp.pipe(TEXTS)
for doc in docs:
    doc.ents = ["SKILL"]