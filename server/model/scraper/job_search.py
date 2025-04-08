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