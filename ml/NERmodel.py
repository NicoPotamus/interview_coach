import spacy
from spacy.util import minibatch, compounding
import random
from tqdm import tqdm
import json  # Import the json module
from spacy.training import Example  # Import Example
from spacy.training import offsets_to_biluo_tags  # Import offsets_to_biluo_tags

# Load training data from a JSON file
TRAIN_DATA = [
    # char ranges are the starting letter to the char after the last letter ie 
    # Job 1 - Frontend Developer
    ("5+ years of experience as a UI developer", {"entities": [(0, 8, "EXPERIENCE")]}),
    ("ADA/WCAG/508 knowledge and testing experience", {"entities": [(0, 12, "SKILL"), (26, 34, "SKILL")]}),  # Adjusted offsets
    ("60++/hr W2", {"entities": [(0, 7, "SALARY")]}),
    
    # Job 2 - Java Developer
    ("9+ years development experience using Java, Springboot, SQL and NoSQL databases", 
     {"entities": [(0, 3, "EXPERIENCE"), (37, 42, "SKILL"), (43, 54, "SKILL"), (55, 59, "SKILL"), (63, 69, "SKILL")]}),
    ("3+ years of experience designing and building cloud-native applications", 
     {"entities": [(0, 2, "EXPERIENCE"), (45, 58, "SKILL")]}),
    ("Experience in Single Page Applications using React/Redux",
     {"entities": [(13, 38, "SKILL"), (44, 50, "SKILL"), (50,56, "SKILL")]}),
    
    # Job 3 - United Airlines Developer
    ("Bachelor's degree in Computer science, software engineering, or related field",
     {"entities": [(0, 17, "EDUCATION"), (21, 37, "DEGREE_FIELD"), (39, 59, "DEGREE_FIELD")]}),
    ("3+ years of experience in a similar role", {"entities": [(0, 30, "EXPERIENCE")]}),
    ("Proficient in C++, UNIX/Linux, Python", {"entities": [(0, 10, "DETERMINER"), (13, 17, "SKILL"), (18, 29, "SKILL"), (30, 37, "SKILL")]}),
    ("Experience with AWS Cloud Services", {"entities": [(15, 32, "SKILL")]}),
    
    # Job 4 - Apprentice Developer
    ("No experience needed", {"entities": [(0, 19, "EXPERIENCE")]}),
    ("Basic proficiency using a computer and the internet", {"entities": [(0, 46, "SKILL")]}),
    ("$16.20 - $19.24 per hour", {"entities": [(0, 22, "SALARY")]}),
    
    # Job 5 - .NET Lead
    ("Proficiency in C# and related Microsoft technologies", {"entities": [(13, 15, "SKILL"), (28, 50, "SKILL")]}),
    ("Strong full-stack development expertise", {"entities": [(7, 32, "SKILL")]}),
    ("Leadership experience", {"entities": [(0, 19, "EXPERIENCE")]}),
    
    # Common patterns across jobs
    ("Must be legally authorized to work in the United States", {"entities": [(0, 51, "REQUIREMENT")]}),
    ("hybrid work model", {"entities": [(0, 15, "WORK_ARRANGEMENT")]}),
    ("Excellent communication skills", {"entities": [(0, 26, "SOFT_SKILL")]}),
    ("problem solving", {"entities": [(0, 14, "SOFT_SKILL")]}),
    ("agile practices", {"entities": [(0, 14, "METHODOLOGY")]}),
    ("CI/CD", {"entities": [(0, 4, "SKILL")]}),
]

# Load a blank spaCy model
nlp = spacy.blank("en")

# Check alignment of entities
for text, annotations in TRAIN_DATA:
    doc = nlp.make_doc(text)
    tags = offsets_to_biluo_tags(doc, annotations["entities"])
    if '-' in tags:
        print(f"Misaligned entities in: {text}")

# Create the NER pipeline
if "ner" not in nlp.pipe_names:
    ner = nlp.add_pipe("ner", last=True)
else:
    ner = nlp.get_pipe("ner")

# Add labels to the NER pipeline
for _, annotations in TRAIN_DATA:
    for ent in annotations.get("entities"):
        ner.add_label(ent[2])

# Print all labels in the NER pipeline
print("Labels in the NER pipeline:", ner.labels)

# Disable other pipeline components during training
other_pipes = [pipe for pipe in nlp.pipe_names if pipe != "ner"]
with nlp.disable_pipes(*other_pipes):
    optimizer = nlp.begin_training()
    for itn in range(30):  # Number of iterations
        random.shuffle(TRAIN_DATA)
        losses = {}
        batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
        for batch in tqdm(batches):
            for text, annotations in batch:
                doc = nlp.make_doc(text)
                example = Example.from_dict(doc, annotations)
                nlp.update([example], drop=0.5, losses=losses)
        print(f"Iteration {itn}, Losses: {losses}")

# Save the model
nlp.to_disk("skills_ner_model")

# Test the model
print("Loading model...")
nlp = spacy.load("skills_ner_model")  # Ensure the model is loaded correctly
test_text = "Proficient in C++, UNIX/Linux, Python"
doc = nlp(test_text)
for ent in doc.ents:
    print(f"{ent.text} ({ent.label_})")
print("Done!")
