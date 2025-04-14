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
from spacy.util import filter_spans

# In[ ]:

model_path = os.path.abspath("./NeuralNetwork/models/trained_ner_model_best")
print(f"Loading model from: {model_path}")
#load our model
nlp = spacy.load(model_path)
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")


# In[ ]:


# Load skills from a linkedin skills file
skill_file = os.path.abspath("./NeuralNetwork/data/linkedin_skills.txt")

with open(skill_file, "r", encoding="utf-8") as f:
    skill_list = [line.strip() for line in f.readlines() if line.strip()]


# In[ ]:


# Load your training data.
with open("./NeuralNetwork/data/gendata2.json", "r") as f:
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

def filter_overlap(entities):
    """
    Filters out overlapping entities from the list.
    Deletes the smaller span if it has the same start_char or end_char as another span.
    """
    filtered_entities = []

    for ent1 in entities:
        start_char1, end_char1, label1 = ent1
        should_add = True  # Flag to determine if ent1 should be added

        for ent2 in entities:
            if ent1 == ent2:
                continue  # Skip comparing the same entity

            start_char2, end_char2, label2 = ent2

            # Check if the spans share the same start_char or end_char
            if start_char1 == start_char2 or end_char1 == end_char2:
                # Keep the larger span
                if (end_char1 - start_char1) < (end_char2 - start_char2):
                    should_add = False  # Do not add ent1 if ent2 is larger
                    break
            # TODO: IF WE ADD ent 1, ent 2 never gets a chance to be left out
            # check for overlap w/out matching chars
            if (start_char1 < start_char2 and end_char1 < start_char2) :
                if (end_char1 - start_char1) < (end_char2 - start_char2):
                    should_add = False  # Do not add ent1 if ent2 is larger
                    break
            if (start_char1 > start_char2 and end_char1 > start_char2):
                if (end_char1 - start_char1) < (end_char2 - start_char2):
                    should_add = False  # Do not add ent1 if ent2 is larger
                    break
            # Check if the spans wraps another
            if start_char1 >= start_char2 and end_char1 <= end_char2:
                should_add = False
                break
        if should_add:
            filtered_entities.append(ent1)

    return filtered_entities

    
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
        doc_spans = []
        for match_id, start, end in matches:
            span = doc[start:end]
           
            doc_spans.append(span)
        
        doc_spans = filter_spans(doc_spans)
        if(doc_spans != []):
            matched_entities = []
            for span in doc_spans:
                matched_entities.append((span.start_char, span.end_char, "SKILL"))
            
            training_data.append((sentence, {"entities": matched_entities}))

    return (training_data)


# In[ ]:


# # Generate training data
# training_data = generate_training_data(training_data)


# # In[ ]:


# # Save labeled data in spaCy format
# output_file = "./output_data/spacy_training_data.json"
# with open(output_file, "w") as f:
#     json.dump(training_data, f, indent=4)


# # In[ ]:


# print(f"Labeled training data saved to {output_file} with {len(training_data)} sentences!")

