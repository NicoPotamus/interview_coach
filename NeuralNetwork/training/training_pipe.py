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
skill_file = os.path.abspath("./data/linkedin_skills.txt")

with open(skill_file, "r", encoding="utf-8") as f:
    skill_list = [line.strip() for line in f.readlines() if line.strip()]


# In[ ]:


# Load your training data.
with open("./data/gendata.json", "r") as f:
    training_data = json.load(f)


# In[ ]:
# make filter fn



# In[ ]:
# Function to clean skills (Fix HTML entities, handle hyphens, preserve single letters)
def clean_skill(skill):
    skill = html.unescape(skill)  # Convert HTML entities (&amp; -> &)
    skill = skill.replace("\t", " ").strip()  # Remove tabs and extra spaces
    skill = re.sub(r"\s+", " ", skill)  # Normalize multiple spaces

    # Normalize ampersands to "and"
    skill = skill.replace("&", "and")  

    # Convert hyphens to spaces for better tokenization
    skill = skill.replace("-", " ")  

    # Preserve single-letter words (e.g., "v" in "hyper v") by adding "_"
    skill = re.sub(r"\b([a-zA-Z])\b", r"\1_", skill)  

    # Normalize apostrophes to avoid tokenization errors
    skill = skill.replace("’", "'")  # Normalize different apostrophe characters

    return skill.lower().strip()  # Convert to lowercase for better matching


# Apply filter function
skill_list = [clean_skill(skill) for skill in skill_list]
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
        if "Show more" in sentence :
            continue
        if "No description found" in sentence:
            continue
        
        used_sentences.add(sentence)

        # Tokenize sentence using spaCy's tokenizer
        doc = nlp(sentence)

        # Ensure skills like "hyper v" are matched correctly
        matches = matcher(doc)
        matched_entities = []
        for match_id, start, end in matches:
            span = doc[start:end]
            
            
            # TODO: Replace OVERLAPS with larger span
            for ent in matched_entities:
                start_char, end_char, label = ent
                # Check if the current span overlaps with any existing entity
                if (start_char < span.start_char and span.start_char > end_char) or (start_char < span.end_char and span.end_char > end_char):
                    if end_char - start_char < span.end_char - span.start_char: 
                        matched_entities.append((span.start_char, span.end_char, "SKILL"))
                        matched_entities.remove(ent)
                    else: 
                        continue
                # check if the current span is wrapping an existing entity
                elif (start_char > span.start_char and end_char < span.end_char):
                    matched_entities.append((span.start_char, span.end_char, "SKILL"))
                    matched_entities.remove(ent)
                # check if current span is already in matched_entities
                elif (not matched_entities.__contains__((span.start_char, span.end_char, "SKILL"))):
                    matched_entities.append((span.start_char, span.end_char, "SKILL"))
                else:
                    continue
            
        if(matched_entities != []):
            training_data.append((sentence, {"entities": matched_entities}))

    return (training_data)


# In[ ]:


# Generate training data
training_data = generate_training_data(training_data)


# In[ ]:


# Save labeled data in spaCy format
output_file = "./output_data/spacy_training_data.json"
with open(output_file, "w") as f:
    json.dump(training_data, f, indent=4)


# In[ ]:


print(f"Labeled training data saved to {output_file} with {len(training_data)} sentences!")

