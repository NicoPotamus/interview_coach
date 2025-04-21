from fastapi import APIRouter, Request, HTTPException
from model.scraper.scraper import search_jobs
from model.scraper.getTrainingData import get_training_data, scrape_training_data
from NeuralNetwork.querey import NER_description
from NeuralNetwork.training.training_pipe import generate_training_data
from NeuralNetwork.training.train_spacy_ner import train_model
from model.output_stat.formatter import rank_skills
from NeuralNetwork.data.merge_data import merge_datasets
import json

router = APIRouter()

@router.get("/api/v1/webscraper")
def scrape_web(job: str, location: str):
    """
    Scrape job descriptions and extract ranked skills using NER.
    Example: /api/v1/webscraper?job=engineer&location=USA
    """
    print('Scraping...')
    try:
        jobs = search_jobs(job, location)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping error: {e}")

    skills = []
    for job in jobs:
        subsetofSkills = NER_description(job['description'])
        skills += subsetofSkills

    ranked_skills = rank_skills(skills)
    return ranked_skills


@router.get("/api/v1/gendata")
def gen_data():
    """
    Generate training data and dump it to output/output2.json
    """
    try:
        t_data = get_training_data()
        with open('./output/output2.json', 'w') as f:
            json.dump(t_data, f)
        return t_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data generation error: {e}")


@router.post("/api/v1/gendatapipe")
def gen_data_pipe(job_titles: list[str]):
    """
    Accepts a JSON array of job titles in the body and returns model training output.
    Example payload: ["Software Engineer", "Data Scientist", ...]
    """
    if not isinstance(job_titles, list):
        raise HTTPException(status_code=400, detail="Invalid input, expected a JSON array of strings")

    try:
        individual_sentences = scrape_training_data(job_titles)
        training_data = generate_training_data(individual_sentences) 
        masters_set = merge_datasets(training_data)
        model_output = train_model(masters_set)
        # TODO: add text notification fn here put both phone numbers " done training "
        return {"success": model_output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training pipeline failed: {e}")