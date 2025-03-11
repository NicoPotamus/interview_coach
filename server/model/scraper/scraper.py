from bs4 import BeautifulSoup
import requests

from .ipRotator import assemble_ip_string  # Use relative import

# function to scrape job urls from a job search page and get a list of urls for each job posting
def retrieve_job_urls(job_search_url):
    # Make an HTTP GET request to get the HTML of the page
    proxy = assemble_ip_string()
    response = requests.get(job_search_url, proxies={"http": proxy})

    # Access the HTML and parse it
    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    # Where to store the scraped data
    job_urls = []

    # Scraping logic
    # gonna go through the entire html page and target elements with the attribute "data-tracking-control-name" 
    # with the value "public_jobs_jserp-result_search-card"
    # then you extract the href url from said element and append it to the job_urls list
    job_url_elements = soup.select("[data-tracking-control-name=\"public_jobs_jserp-result_search-card\"]")
    for job_url_element in job_url_elements:
      # Extract the job page URL and append it to the list
      job_url = job_url_element["href"]
      job_urls.append(job_url)

    return job_urls  


# adjust the separator on line 57 to make the description more readable it has mad extra characters
def scrape_job(job_url):
    
    response = requests.get(job_url)
    
    html = response.text
    
    soup = BeautifulSoup(html, "html.parser")
    
    title_element = soup.select_one("h1")
    title = title_element.get_text().strip() if title_element else "No title found"
    
    company_element = soup.select_one("[data-tracking-control-name=\"public_jobs_topcard-org-name\"]")
    company_name = company_element.get_text().strip() if company_element else "No Company Name found"
    company_url = company_element["href"] if company_element else "No Company Name found"
    
    location_element = soup.select_one("[data-tracking-control-name=\"public_jobs_topcard-org-name\"]")
    location = location_element.get_text().strip() if location_element else "No location Name found"
    
    salary_element = soup.select_one(".salary")
    if salary_element:
        salary = salary_element.get_text().strip()
    else:  
        salary = None
    
    
    # now we gotta play with the criteria to get that information nicely
    description_element = soup.select_one(".description__text .show-more-less-html")
    description= ""
    if description_element:
        description = description_element.get_text(separator=" ").replace('\n', ' ').strip()
    else:
        description = "No description found."
    
    job = {
        "title": title,
        "company_name": company_name,
        "company_url": company_url,
        "location": location,
        "salary": salary,
        "description": description
    }
    return job

# function to create a generic search based on user parameters
def search_jobs(keywords, location):
    # Create the URL based on the keywords and location
    job_search_url = f"https://www.linkedin.com/jobs/search?keywords={keywords}&location={location}&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0"
    
    # Retrieve the job URLs
    job_urls = retrieve_job_urls(job_search_url)
    
    # Scrape the job details
    jobs = []
    for job_url in job_urls:
        job = scrape_job(job_url)
        jobs.append(job)
    
    return jobs

    
#main function
def main():
    #test data extraction from posting GOOD, but the description is a bit messy
    jsonOut = scrape_job("https://www.linkedin.com/jobs/view/talent-sourcer-business-recruiter-at-nextdoor-4175126786?position=1&pageNum=0&refId=tN0PAUlrGxG3XCfYSe9HVQ%3D%3D&trackingId=rwSmpNpOvpiTlpyEr7%2FhFw%3D%3D")
    print("loading")
    #print(jsonOut)
    
    # test url aggregation GOOD
    job_urls = retrieve_job_urls("https://www.linkedin.com/jobs/search?keywords=Software%20Engineer&location=USA&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0")
    #print(job_urls)
    
    # test url factory
    jobs = search_jobs("Cyber security", "USA")
    print(jobs)
    
    

if __name__ == "__main__":
    main()