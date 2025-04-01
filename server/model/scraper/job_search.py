import http.client
import json
import os
#from dotenv import load_dotenv

# # Load API key from .env file
# load_dotenv()
# API_KEY = os.getenv("RAPIDAPI_KEY")

# API host
API_HOST = "jsearch.p.rapidapi.com"

# List of job titles to search
job_titles = [
    # Technology & Software Development
    "Software Engineer", "Data Scientist", "Machine Learning Engineer", "Cybersecurity Analyst",
    "Cloud Solutions Architect", "DevOps Engineer", "Full-Stack Developer", "IT Support Specialist",
    "Embedded Systems Engineer", "AI Research Scientist",

    # Business & Finance
    "Financial Analyst", "Investment Banker", "Actuary", "Risk Management Specialist", "Accountant",
    "Management Consultant", "Payroll Administrator", "Tax Advisor", "Business Intelligence Analyst",
    "Supply Chain Manager",

    # Healthcare & Medicine
    "Registered Nurse", "Physician Assistant", "Medical Laboratory Technician", "Physical Therapist",
    "Radiologic Technologist", "Clinical Research Associate", "Pharmacist", "Health Informatics Specialist",
    "Nutritionist", "Medical Billing Specialist",

    # Science & Engineering
    "Biomedical Engineer", "Civil Engineer", "Electrical Engineer", "Chemical Engineer", "Aerospace Engineer",
    "Geospatial Analyst", "Materials Scientist", "Environmental Engineer", "Robotics Engineer", "Astrophysicist",

    # Creative & Design
    "Graphic Designer", "UX/UI Designer", "Motion Graphics Artist", "Interior Designer", "Art Director",
    "Fashion Designer", "Video Editor", "3D Modeler", "Digital Marketing Specialist", "Game Designer",

    # Skilled Trades & Manufacturing
    "CNC Machinist", "Electrician", "HVAC Technician", "Plumber", "Auto Mechanic", "Industrial Designer",
    "Construction Project Manager", "Carpenter", "Welder", "Tool and Die Maker",

    # Media & Communications
    "Journalist", "Technical Writer", "Public Relations Specialist", "Content Strategist", "Social Media Manager",
    "SEO Specialist", "Copywriter", "Broadcast Producer", "Event Coordinator", "Podcast Producer",

    # Education & Research
    "Elementary School Teacher", "College Professor", "Curriculum Developer", "Instructional Designer",
    "Education Consultant", "Academic Advisor", "Special Education Teacher", "Research Scientist", "Librarian",
    "Educational Technologist",

    # Legal & Compliance
    "Corporate Lawyer", "Paralegal", "Intellectual Property Attorney", "Compliance Officer", "Contract Manager",
    "Data Privacy Specialist", "Immigration Attorney", "Legal Consultant", "Criminal Defense Attorney",
    "Employment Law Specialist",

    # Emerging & Future Jobs
    "Quantum Computing Researcher", "AI Ethics Consultant", "Space Systems Engineer", "Blockchain Developer",
    "Virtual Reality Developer", "Renewable Energy Engineer", "Smart Cities Consultant", "Genetic Data Analyst",
    "Cyber-Physical Systems Engineer", "Digital Twin Architect"
]

conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")

#were going to hide this in a .env file
headers = {
    'x-rapidapi-key': "2a7c3b29d5mshf4db3eeb2b74a9dp12ff9djsn70ecfd9294b3",
    'x-rapidapi-host': "jsearch.p.rapidapi.com"
}

# Store results
results = {}

# Fetch job data for each job title
for title in job_titles:
    endpoint = f"/estimated-salary?job_title={title.replace(' ', '%20')}&location=united%20states&location_type=ANY&years_of_experience=ALL"
    conn.request("GET", endpoint, headers=headers)
    
    res = conn.getresponse()
    data = res.read()
    
    # Store response in dictionary
    results[title] = json.loads(data.decode("utf-8"))

# Save results to JSON file
output_file = "job_data.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=4)

print(f"Job data saved to {output_file}")