#!/usr/bin/env python
# coding: utf-8

# # Pipeline for genData from scraper to train model

# In[ ]:


import spacy
import json
from spacy.training.example import Example
import matplotlib.pyplot as plt
from spacy.matcher import PhraseMatcher
import os
import html
import re

# In[ ]:

model_path = os.path.abspath("./models/trained_ner_model_best")
print(f"Loading model from: {model_path}")
#load our model
nlp = spacy.load(model_path)
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")


# In[ ]:


# Load skills from a linkedin skills file
skill_file = "./data/linkedin_skills.txt"

with open(skill_file, "r", encoding="utf-8") as f:
    skill_list = [line.strip() for line in f.readlines() if line.strip()]


# In[ ]:


# Load your training data.
with open("./data/gendata.json", "r") as f:
    training_data = json.load(f)


# In[ ]:
# make filter fn



# In[ ]:


# Apply filter function

# ✅ Use PhraseMatcher to add skills for proper tokenization
skill_patterns = [nlp.make_doc(skill) for skill in skill_list]
matcher.add("SKILL", skill_patterns)


# In[ ]:


def generate_training_data(sentence_templates):
    """Generates labeled training data for spaCy's NER model"""
    training_data = []
    used_sentences = set()

    for sentence in sentence_templates:

        # Ensure uniqueness to prevent duplicate patterns
        if sentence in used_sentences:
            continue
        if sentence.contains("Show more") | sentence.contains("No description found"):
            continue
        
        used_sentences.add(sentence)

        # Tokenize sentence using spaCy's tokenizer
        doc = nlp(sentence)

        # Ensure skills like "hyper v" are matched correctly
        matches = matcher(doc)
        matched_entities = []
        for match_id, start, end in matches:
            span = doc[start:end]

            matched_entities.append((span.start_char, span.end_char, "SKILL"))

        if(matched_entities != []):
            training_data.append((sentence, {"entities": matched_entities}))

    return training_data


# In[ ]:


# Generate training data
training_data = generate_training_data(training_data)


# In[ ]:


# Save labeled data in spaCy format
output_file = "./data/spacy_training_data.json"
with open(output_file, "w") as f:
    json.dump(training_data, f, indent=4)


# In[ ]:


print(f"Labeled training data saved to {output_file} with {len(training_data)} sentences!")

