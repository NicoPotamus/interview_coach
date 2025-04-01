from flask import Flask, request
from flask_cors import CORS
from model.scraper.scraper import search_jobs
from model.scraper.getTrainingData import get_training_data, get_training_data_sm
import json


app = Flask(__name__)
CORS(app)
# http://127.0.0.1:5000/api/v1/webscraper?job=engineer&location=USA
@app.route('/api/v1/webscraper', methods=['GET'])
def scrape_web():
    print('Scraping...')
    job = request.args.get('job')
    location = request.args.get('location')
    jobs = search_jobs(job, location)
    return jobs

#http://127.0.0.1:5000/api/v1/gendata
@app.route('/api/v1/gendata', methods=['GET'])
def gen_data():
    t_data = get_training_data_sm()
    with open('./output/output.json' , 'w') as f:
        json.dump(t_data, f)
        
    return t_data

if __name__ == '__main__':
   app.run(host="0.0.0.0", port=5000, debug=True)