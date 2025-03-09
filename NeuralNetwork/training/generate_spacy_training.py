import pandas as pd
import json
import re
import random

# Load the processed skills data
df = pd.read_csv("../data/processed_skills.csv")

# Sentence templates
sentence_templates = [
    "{} is a required skill for this position.",
    "Candidates should have expertise in {}.",
    "Proficiency in {} is essential for this job.",
    "A background in {} is strongly preferred.",
    "We are looking for applicants skilled in {}.",
    "Experience with {} is a significant advantage.",
    "{} knowledge is a key qualification.",
    "An ideal candidate must be proficient in {}.",
    "Knowledge of {} is required for this role.",
    "{} is an important skill for candidates.",
    "Candidates should demonstrate strong {} skills.",
    "Proficiency in {} is preferred by employers.",
    "Having a solid background in {} will be beneficial.",
     "{} is a valuable skill for this position.",
    "Having experience in {} will be beneficial.",
    "Familiarity with {} is a must-have for this role.",
    "Candidates should be well-versed in {}.",
    "Employers seek professionals with {} expertise.",
    "A solid foundation in {} is required.",
    "{} is highly valued in this industry.",
    "Strong {} skills are necessary for success in this role.",
    "Understanding {} is crucial for this job.",
    "Applicants must demonstrate competency in {}.",
    "A candidate must be experienced in {}.",
    "{} proficiency will help you excel in this role.",
    "The ability to work with {} is a must-have for this position.",
    "We are prioritizing candidates familiar with {}.",
    "Employers value professionals who are skilled in {}."
]

training_data = []
for job_title, skills in df.groupby("Title")["Skill"].apply(list).to_dict().items():
    description = f"We are hiring a {job_title}. "

    # Randomly select skill sentences and mix them
    skill_sentences = [random.choice(sentence_templates).format(skill) for skill in skills[:5]]
    description += " ".join(skill_sentences)

    entities = []
    used_ranges = []

    for skill in skills[:5]:  
        match = re.search(r'\b' + re.escape(skill) + r'\b', description)  
        if match:
            start_idx, end_idx = match.start(), match.end()

            if not any(s <= start_idx < e or s < end_idx <= e for s, e in used_ranges):
                entities.append((start_idx, end_idx, "SKILL"))
                used_ranges.append((start_idx, end_idx))

    if entities:
        training_data.append((description, {"entities": entities}))


# Save as a JSON file for spaCy training
with open("../data/spacy_training_data.json", "w") as f:
    json.dump(training_data, f, indent=4)

print("Fixed and saved training data as 'spacy_training_data.json'")