
import re
from .scraper import search_jobs


job_titles = [
     # Hospitality & Travel
    "Sommelier", "Cruise Director", "Hotel Concierge", "Travel Consultant", "Resort Manager",
    "Tour Guide", "Event Planner", "Flight Attendant", "Airline Operations Manager", "Travel Blogger",

    # Arts, Culture & Entertainment
    "Museum Curator", "Stunt Coordinator", "Voice Actor", "Music Composer", "Art Restorer",
    "Theatre Producer", "Tattoo Artist", "Cinematographer", "Foley Artist", "Set Designer",

    # Nature, Environment & Agriculture
    "Wildlife Biologist", "Park Ranger", "Aquaculture Technician", "Urban Farmer", "Forester",
    "Horticulturist", "Environmental Health Officer", "Conservation Scientist", "Beekeeper", "Soil and Water Conservationist",

    # Sports & Recreation
    "Athletic Trainer", "Sports Statistician", "Referee/Umpire", "Sports Psychologist", "Recreation Director",
    "Professional Gamer", "Equestrian Trainer", "Fitness Influencer", "Climbing Guide", "Scuba Instructor",

    # Transportation & Logistics
    "Air Traffic Controller", "Railroad Conductor", "Maritime Pilot", "Drone Operator", "Logistics Coordinator",
    "Freight Broker", "Delivery Route Planner", "Customs Compliance Officer", "Port Operations Manager", "Transportation Planner",

    # Retail & Consumer Services
    "Visual Merchandiser", "Antique Appraiser", "E-commerce Manager", "Customer Experience Designer", "Mystery Shopper",
    "Retail Buyer", "Loss Prevention Specialist", "Store Planner", "Window Display Artist", "Shopping Assistant",

    # Animal & Veterinary Services
    "Veterinary Technician", "Animal Behaviorist", "Pet Groomer", "Wildlife Rehabilitator", "Animal Control Officer",
    "Zookeeper", "Equine Massage Therapist", "Kennel Manager", "Exotic Animal Specialist", "Pet Nutrition Consultant",

    # Religion & Spiritual Services
    "Chaplain", "Religious Educator", "Interfaith Minister", "Spiritual Life Coach", "Monastic Artisan",
    "Theologian", "Ritual Coordinator", "Pastoral Counselor", "Worship Music Leader", "Temple Administrator",

    # Government & Public Service
    "Urban Planner", "Census Enumerator", "Foreign Service Officer", "Public Affairs Specialist", "Emergency Management Director",
    "City Clerk", "Community Outreach Coordinator", "Policy Analyst", "Legislative Aide", "Municipal Inspector",

    # Additional Titles
    "Ethnomusicologist", "Disaster Relief Coordinator", "Toy Designer", "Hydrologist", "Forensic Linguist",
    "Esports Coach", "Sleep Technologist", "Accessibility Specialist", "Auctioneer", "Cultural Heritage Manager"
]

def get_training_data():
    allJobs = []
    sentence_pattern = re.compile(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s')
    individual_sentences = []
    
    #get all jobs for each posting
    for jobT in job_titles:
        jobJSON = search_jobs(jobT, "USA")
        allJobs.extend(jobJSON)
        
    # separate sentences
    for job in allJobs:
        description = job.get('description')
        sentences = sentence_pattern.split(description)
        individual_sentences.extend(sentences)
    
    return individual_sentences

def scrape_training_data(job_titles):
    allJobs = []
    sentence_pattern = re.compile(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s')
    individual_sentences = []
    
    #get all jobs for each posting
    for jobT in job_titles:
        jobJSON = search_jobs(jobT, "USA")
        allJobs.extend(jobJSON)
        
    # separate sentences
    for job in allJobs:
        description = job.get('description')
        sentences = sentence_pattern.split(description)
        individual_sentences.extend(sentences)
    
    return individual_sentences
    
def get_training_data_sm():
    allJobs = []
    sentence_pattern = re.compile(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s')
    individual_sentences = []
    
    allJobs = search_jobs("nurse", "USA")
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

        
        