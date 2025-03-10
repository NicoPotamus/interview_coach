import http.client

conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")


#were going to hide this in a .env file
headers = {
    'x-rapidapi-key': "2a7c3b29d5mshf4db3eeb2b74a9dp12ff9djsn70ecfd9294b3",
    'x-rapidapi-host': "jsearch.p.rapidapi.com"
}

conn.request("GET", "/estimated-salary?job_title=nodejs%20developer&location=new%20york&location_type=ANY&years_of_experience=ALL", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))