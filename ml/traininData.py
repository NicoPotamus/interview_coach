#importing the spacy library
import http.client

conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "2a7c3b29d5mshf4db3eeb2b74a9dp12ff9djsn70ecfd9294b3",
    'x-rapidapi-host': "jsearch.p.rapidapi.com"
}

conn.request("GET", "/job-details?job_id=20N57zBfi3eT9BdpAAAAAA%3D%3D&country=us", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))

doc1 = nlp("Must have SDK Experience.")
doc1.ents(Span(doc1, 2, 3, label="SKILL"))