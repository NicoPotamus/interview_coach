
import re
from .scraper import search_jobs


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

def get_training_data():
    allJobs = []
    sentence_pattern = re.compile(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s')
    individual_sentences = []
    allJobs = search_jobs("Software Engineer", "USA")
    #get all jobs for each posting
    # for jobT in job_titles:
    #     jobJSON = search_jobs(jobT, "USA")
    #     allJobs.extend(jobJSON)
    # separate sentences
    for job in allJobs:
        description = job.get('description')
        sentences = sentence_pattern.split(description)
        individual_sentences.extend(sentences)
    return individual_sentences

# def main():
#     results = get_training_data()
#     print(results)
#     print(len(results), "sentences")
#     return
    
# if __name__ == "__main__":
#     main()

        
        