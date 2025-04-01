import http.client
import json

conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "2a7c3b29d5mshf4db3eeb2b74a9dp12ff9djsn70ecfd9294b3",
    'x-rapidapi-host': "jsearch.p.rapidapi.com"
}

job_id = "20N57zBfi3eT9BdpAAAAAA=="

# This is for the full listing
get_request = f"/job-details?job_id={job_id}&country=us&fields=job_description"

conn.request("GET", get_request, headers=headers)

res = conn.getresponse()
data = res.read()

# Decode the response data
decoded_data = data.decode("utf-8")

json_data = json.loads(decoded_data)

# Locate and clean the job_description
if "data" in json_data and isinstance(json_data["data"], list):
    for job in json_data["data"]:
        if "job_description" in job:
            # Replace \n or \\n with a space
            job["job_description"] = job["job_description"].replace("\n", " ").replace("\\n", " ")

# Output the cleaned JSON data
print("\nCleaned JSON Response:")
print(json.dumps(json_data, indent=4))

job_description = json_data["data"][0].get("job_description", "")
print(job_description)