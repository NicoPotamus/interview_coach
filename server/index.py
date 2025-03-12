from flask import Flask, request
from flask_cors import CORS
from model.scraper.scraper import search_jobs

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

if __name__ == '__main__':
   app.run(host="0.0.0.0", port=5000)