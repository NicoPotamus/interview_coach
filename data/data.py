import http.client

conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "2a7c3b29d5mshf4db3eeb2b74a9dp12ff9djsn70ecfd9294b3",
    'x-rapidapi-host': "jsearch.p.rapidapi.com"
}

conn.request("GET", "/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all", headers=headers)

res = conn.getresponse()
data = res.read()
decodedData = (data.decode("utf-8"))

with open("data.txt", "w") as file:
    file.write(decodedData)

