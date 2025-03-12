from flask import Flask, request
from flask_cors import CORS
from model.scraper.scraper import search_jobs
from model.scraper.getTrainingData import get_training_data
import argparse

# Parse command-line arguments
parser = argparse.ArgumentParser(description='Run the Flask app with a specified file path.')
parser.add_argument('--filepath', type=str, required=True, help='The file path to save training data')
args = parser.parse_args()

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
    file_path = args.filepath
    t_data = get_training_data()
    with open(file_path, 'w') as file:
        # Write content to the file
        for sentence in t_data:
            file.write(sentence)
    return t_data

if __name__ == '__main__':
   app.run(host="0.0.0.0", port=5000)