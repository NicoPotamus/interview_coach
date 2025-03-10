import json
import random
import requests

# Open and read the JSON file
with open('proxies.json', 'r') as file:
    data = json.load(file)

def get_random_proxy():
    randomProxy = random.choice(data)
    return randomProxy

def assemble_ip_string():
    proxy = get_random_proxy()
    is_ip_valid = False
    ip_string = ""
    while  not is_ip_valid:
        try:
            ip_string = f"http://{proxy['ip_address']}:{proxy['port']}"
            requests.get("http://linkedin.com", proxies={"http": ip_string})
            is_ip_valid = True
        except:
            proxy = get_random_proxy()
            print("Invalid IP, trying another one")
        
    return proxy

def main():
    print(assemble_ip_string())
    

if __name__ == "__main__":
    main()