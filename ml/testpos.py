import spacy

nlp = spacy.load("en_core_web_sm")
text = "user must have Experience Using react"
doc= nlp(text)

for token in doc:
    print(token.text, token.pos_, token.dep_,)
    print(spacy.explain(token.dep_))
    print()