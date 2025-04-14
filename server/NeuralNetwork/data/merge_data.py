#!/usr/bin/env python
# coding: utf-8

# # This is a program to merge the current dataset and an oncoming one

# In[2]:


import json
import hashlib


# In[ ]:

def merge_datasets(data2):
    with open("./NeuralNetwork/data/data.json", "r", encoding="utf-8") as f1:
        data1 = json.load(f1)

    # with open("data/new_data.json", "r", encoding="utf-8") as f2:
    #     data2 = json.load(f2)
    # Combine datasets
    combined = data1 + data2

    # Deduplicate based on (text, sorted_entities)
    seen = set()
    deduped = []

    for item in combined:
        text, annotations = item
        # Sort entities for consistent comparison
        sorted_entities = tuple(sorted(tuple(e) for e in annotations["entities"]))
        identifier = (text, sorted_entities)

        if identifier not in seen:
            seen.add(identifier)
            deduped.append((text, annotations))

    # create new json of new data
    # Serialize the first item in data2 for hashing
    value = json.dumps(data2[0], sort_keys=True)  # Ensure consistent hashing
    hashed_value = hashlib.sha256(value.encode("utf-8")).hexdigest()
    print(f"SHA-256: {hashed_value}")
    file_name = f"./NeuralNetwork/data/{hashed_value}.json"  # Add .json extension to the file name
    
    # write to unique file
    with open(file_name, "w", encoding="utf-8") as f:
            json.dump(data2, f, indent=4)


    # Save to a new JSON file
    with open("./NeuralNetwork/data/data.json", "w", encoding="utf-8") as f:
        json.dump(deduped, f, indent=4)

    print(f"Merged training data saved to 'merged_training_data.json' with {len(deduped)} unique examples.")

    return deduped


