from flask import Flask, request
from model.scraper.scraper import search_jobs

app = Flask(__name__)

@app.route('/api/v1/webscraper', methods=['GET'])
def scrape_web():
    job = request.args.get('job')
    location = request.args.get('location')
    jobs = search_jobs(job, location)
    return jobs

if __name__ == '__main__':
   app.run()
