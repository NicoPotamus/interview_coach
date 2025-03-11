import spacy

# Load models
best_model = spacy.load("../models/trained_ner_model_best")
regular_model = spacy.load("../models/trained_ner_model")

# Load your trained NER model
nlp = regular_model
# Example job description
job_description = """
We are looking for an experienced Systems Administrator with expertise in Hyper-V, VMware, and Windows Server management.
The ideal candidate should have a strong background in networking, including proficiency in DNS, DHCP, and VPN configuration.
Knowledge of cloud platforms such as AWS and Azure is highly preferred.
"""

# Process the text through the model
doc = nlp(job_description)

# Extract detected skills
detected_skills = [(ent.text, ent.label_) for ent in doc.ents if ent.label_ == "SKILL"]

# Print results
print("Detected Skills:")
for skill, label in detected_skills:
    print(f"- {skill}")