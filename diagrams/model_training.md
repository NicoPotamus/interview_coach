```mermaid
flowchart TD
    A["Start train_model(training_data)"] --> B["Load base spaCy model\nnlp = spacy.load('en_core_web_sm')"]
    B --> C{"Is 'ner' in nlp.pipe_names?"}
    C -- No --> D["Add NER pipe\nner = nlp.add_pipe('ner', last=True)"]
    C -- Yes --> E["Get existing NER pipe\nner = nlp.get_pipe('ner')"]
    D --> F["Add label SKILL\nner.add_label('SKILL')"]
    E --> F

    F --> G["Prepare training examples"]
    subgraph PrepareExamples
        G1["Initialize empty train_examples list"]
        G2["For each (text, annotations) in training_data"]
        G3["doc = nlp.make_doc(text)"]
        G4["example = Example.from_dict(doc, annotations)"]
        G5["Append example to train_examples"]
        G1 --> G2 --> G3 --> G4 --> G5
    end
    F --> PrepareExamples

    PrepareExamples --> H["Init tracking variables\nloss_history = []\nbest_loss = inf\nbest_epoch = 0"]
    H --> I["Identify pipes to freeze\nother_pipes = [pipe for pipe in nlp.pipe_names if pipe != 'ner']"]
    I --> J["Disable other pipes\nwith nlp.disable_pipes(*other_pipes)"]
    J --> K["Resume training & set LR\noptimizer = nlp.resume_training()\noptimizer.learn_rate = 0.002"]

    K --> L["Epoch loop: for epoch in range(35)"]
    subgraph EpochLoop
        L1["Update model\nnlp.update(train_examples, drop=0.2, sgd=optimizer, losses=losses)"]
        L2["Append loss\nloss_history.append(losses['ner'])"]
        L3["Print epoch & losses"]
        L4{"losses['ner'] < best_loss?"}
        L4 -- Yes --> L5["Update best_loss & best_epoch\nSave best model:\nnlp.to_disk('./NeuralNetwork/models/trained_ner_model_best')"]
        L4 -- No --> L6["Do nothing"]
        L5 --> L7["Next epoch"]
        L6 --> L7
    end

    L7 --> M{"More epochs?"}
    M -- Yes --> K
    M -- No --> N["Exit loop"]

    N --> O["Save final model:\nnlp.to_disk('./NeuralNetwork/models/trained_ner_model')"]
    O --> P["Plot loss history\nplt.plot(range(1,len(loss_history)+1), loss_history)"]
    P --> Q["Save plot image:\nplt.savefig('./NeuralNetowrk/data/plot.png')"]
    Q --> R["Show plot\nplt.show()"]
    R --> S["Return completion message\nModel training complete! Best model saved at epoch best_epoch with loss best_loss"]
    S --> T["End"]
  S --> T[End]
  ```