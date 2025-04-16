#!/usr/bin/env python
# coding: utf-8

# In[24]:


import spacy
import json
from spacy.training.example import Example
import matplotlib.pyplot as plt



# In[ ]:
def train_model (training_data):
    nlp = spacy.load("en_core_web_sm")  # Load the base model

    if "ner" not in nlp.pipe_names:
        ner = nlp.add_pipe("ner", last=True)
    else:
        ner = nlp.get_pipe("ner")    

    # Add the "SKILL" label
    ner.add_label("SKILL")

    # Prepare training examples
    train_examples = []
    for text, annotations in training_data:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, annotations)
        train_examples.append(example)

    # Track loss values & best model checkpoint
    loss_history = []
    best_loss = float("inf")
    best_epoch = 0

    # Identify the pipelines we do NOT want to update (freeze them).
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != "ner"]

    # Use the context manager to disable updates for these components
    with nlp.disable_pipes(*other_pipes):
        # Initialize optimizer with lower learning rate
        optimizer = nlp.resume_training()
        optimizer.learn_rate = 0.002  

        for epoch in range(35):  # Training for up to 35 epochs but stopping early if needed
            losses = {}
            nlp.update(train_examples, drop=0.2, sgd=optimizer, losses=losses)
            loss_history.append(losses["ner"])
            print(f"Epoch {epoch+1}, Loss: {losses}")

            # Save best model if loss improves
            if losses["ner"] < best_loss:
                best_loss = losses["ner"]
                best_epoch = epoch + 1
                nlp.to_disk("./NeuralNetwork/models/trained_ner_model_best")

    # Save final trained model
    nlp.to_disk("./NeuralNetwork/models/trained_ner_model")

    # Plot loss trend
    plt.plot(range(1, len(loss_history) + 1), loss_history, marker='o', linestyle='-')
    plt.xlabel("Epoch")
    plt.ylabel("NER Loss")
    plt.title("NER Model Training Loss Over Time")
    plt.savefig("./NeuralNetowrk/data/plot.png")
    plt.show()

    return (f"Model training complete! Best model saved at epoch {best_epoch} with loss {best_loss}")
