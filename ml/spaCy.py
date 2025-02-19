import spacy

# process string w/ nlp obj
nlp = spacy.load("en_core_web_sm")

doc = nlp("hello world")

# iterate over tokens
for token in doc:
    print(token.text) 

# DOCS TOKENS SPANS-----------------------------------------------------------
nlpp = spacy.blank("en")

doc = nlp("i like kangaroos")

firstT = doc[0]

print(firstT.text)

# ARRAY SLICING-------------------------------------------------------------

nlp = spacy.blank("en")

# Process the text
doc = nlp("I like tree kangaroos and narwhals.")

# A slice of the Doc for "tree kangaroos"
tree_kangaroos = doc[2:4]
print(tree_kangaroos.text)

# A slice of the Doc for "tree kangaroos and narwhals" (without the ".")
tree_kangaroos_and_narwhals = doc[2:6]
print(tree_kangaroos_and_narwhals.text)

# LEXICAL ATTRIBUTES---------------------------------------------------------
# 
nlp = spacy.blank("en")

# Process the text
doc = nlp(
    "In 1990, more than 60% of people in East Asia were in extreme poverty. "
    "Now less than 4% are."
)

# Iterate over the tokens in the doc
for token in doc:
    # Check if the token resembles a number
    if token.like_num:
        # Get the next token in the document
        next_token = doc[token.i + 1]
        # Check if the next token's text equals "%"
        if next_token.text == "%":
            print("Percentage found:", token.text)
            
            
# Pipeline packages---------------------------------------------------------
#Trained pipelines allow you to generalize based on a set of training examples. Once they’re trained, they use binary weights 
#to make predictions. That’s why it’s not necessary to ship them with their training data.

# https://stackoverflow.com/questions/54855780/how-to-create-ner-pipeline-with-multiple-models-in-spacy


#-------------check sentence structure
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("Berlin looks like a nice city")

# Iterate over the tokens
for token in doc:
    # Check if the current token is a proper noun
    if token.pos_ == "PROPN":
        # Check if the next token is a verb
        if doc[token.i + 1].pos_ == "VERB":
            print("Found proper noun before a verb:", token.text)
