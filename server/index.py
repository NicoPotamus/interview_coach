from flask import Flask, request


app = Flask(__name__)

@app.route('/api/v1/webscraper', methods=['GET'])
def scrape_web():
    job = request.args.get('job')
    location = request.args.get('location')
    jobs = search_jobs(job, location)
    return f'''looking for {job} in {location}'''

if __name__ == '__main__':
   app.run()
