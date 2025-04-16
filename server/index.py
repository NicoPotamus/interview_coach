from flask import Flask, request
from flask_cors import CORS
from model.scraper.scraper import search_jobs
from model.scraper.getTrainingData import get_training_data, get_training_data_sm, scrape_training_data
import json
from NeuralNetwork.querey import NER_description
from NeuralNetwork.training.training_pipe import generate_training_data
#make train_model function
from NeuralNetwork.training.train_spacy_ner import train_model
from model.output_stat.formatter import rank_skills
from NeuralNetwork.data.merge_data import merge_datasets

app = Flask(__name__)
CORS(app)


# http://127.0.0.1:5000/api/v1/webscraper?job=engineer&location=USA
@app.route('/api/v1/webscraper', methods=['GET'])
def scrape_web():
    print('Scraping...')
    job = request.args.get('job')
    location = request.args.get('location')
    jobs = search_jobs(job, location)
    
    skills = []
    for job in jobs:
        subsetofSkills = NER_description(job['description'])
        skills += subsetofSkills
    
    ##CALL FORMATTER HERE AND RETURN IT
    return rank_skills(skills)



#http://127.0.0.1:5000/api/v1/gendata
@app.route('/api/v1/gendata', methods=['GET'])
def gen_data():
    t_data = get_training_data()
    with open('./output/output2.json' , 'w') as f:
        json.dump(t_data, f)
        
    return t_data



# http://127.0.0.1:5000/api/v1/gendatapipe
# attatch json array to body of post request
@app.route('/api/v1/gendatapipe', methods=['POST'])
def gen_data_pipe():
    # Parse the JSON array from the request body
    json_array = request.get_json()

    # Ensure the input is a valid JSON array
    if not isinstance(json_array, list):
        return {"error": "Invalid input, expected a JSON array"}, 400

    # Process each item in the array
    individual_sentences = scrape_training_data(json_array)

    #create training set
    training_data = generate_training_data(individual_sentences)

    #TODO: mix up data
    masters_set = merge_datasets(training_data)

    modelOutput = train_model(masters_set)
    #start training
    return {"success": modelOutput}, 200


if __name__ == '__main__':
   app.run(host="0.0.0.0", port=5000, debug=True)