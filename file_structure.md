# Interview Coach Project Structure

This document provides an overview of all files in the project, their purpose, and how they relate to each other.

## Project Files Overview

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `LICENSE` | License information for the project | Legal document for the codebase |
| `ToDo.md` | Task list and future development plans | Project management document |
| `scratch.http` | HTTP request tests and examples | Used for testing API endpoints |
| `file_structure.md` | This file - documentation of project structure | Project documentation |

## Client (Frontend)

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `client/app.json` | Configuration for the Expo app | Core configuration for the React Native app |
| `client/babel.config.js` | Babel configuration for JavaScript transpilation | Used by the build process |
| `client/expo-env.d.ts` | Type definitions for Expo environment | TypeScript support for Expo |
| `client/global.css` | Global CSS styles | Used throughout the frontend |
| `client/metro.config.js` | Metro bundler configuration | Used by React Native bundler |
| `client/nativewind-env.d.ts` | Type definitions for NativeWind | TailwindCSS integration with React Native |
| `client/package.json` | NPM package configuration | Defines dependencies and scripts |
| `client/README.md` | Documentation for the client | Frontend documentation |
| `client/tailwind.config.js` | TailwindCSS configuration | Configures CSS utility framework |
| `client/tsconfig.json` | TypeScript configuration | TypeScript compiler settings |

### Client App Structure

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `client/app/_layout.tsx` | Main layout component | Parent component for all screens |
| `client/app/index.tsx` | Main entry point | Root application component |

### Client Components

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `client/app/components/HomePage.tsx` | Home page component | Main landing page UI |
| `client/app/components/JobPostings.tsx` | Job listings component | Displays job postings |
| `client/app/components/navbar.tsx` | Navigation bar component | Used across the application |
| `client/app/components/OutputDisplay.tsx` | Results display component | Shows analysis results |
| `client/app/components/SkillAnalysis.tsx` | Skills analysis component | Processes and displays skill data |

### Client Models

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `client/app/models/dataEnvelope.ts` | Data structure definitions | Defines data formats used in the app |
| `client/app/models/myFetch.ts` | Custom fetch implementation | Handles API requests to backend |
| `client/app/models/scraper.ts` | Frontend scraper interface | Communicates with backend scrapers |

### Client Assets

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `client/assets/fonts/SpaceMono-Regular.ttf` | Space Mono font | Typography used in the app |
| `client/assets/images/adaptive-icon.png` | Adaptive app icon | Used for app display on devices |
| `client/assets/images/favicon.png` | Favicon | Used for browser tabs |
| `client/assets/images/icon.png` | App icon | Main application icon |
| `client/assets/images/partial-react-logo.png` | React logo partial | UI element for React branding |
| `client/assets/images/react-logo.png` | React logo | UI element for React branding |
| `client/assets/images/react-logo@2x.png` | React logo (2x) | Higher resolution for Retina displays |
| `client/assets/images/react-logo@3x.png` | React logo (3x) | Highest resolution for displays |
| `client/assets/images/splash-icon.png` | Splash screen icon | Shown during app loading |

## Server (Backend)

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/dockerfile` | Docker configuration for server | Container setup for main server |
| `server/dockerfile2` | Alternative Docker configuration | Secondary container setup |
| `server/index.py` | Main server entry point | Core backend server code |
| `server/requirements.txt` | Python dependencies | List of required packages |
| `server/requirements2.txt` | Alternative Python dependencies | Secondary list of packages |

### Server Data

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/data/job_data.json` | Job data storage | Contains scraped job data |
| `server/output/output.json` | Output data | Results from analysis processes |

### Server Model - Scraper

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/model/scraper/getTrainingData.py` | Training data retrieval | Fetches data for model training |
| `server/model/scraper/ipRotator.py` | IP rotation logic | Manages IP addresses for scraping |
| `server/model/scraper/job_details.py` | Job details scraper | Extracts detailed job information |
| `server/model/scraper/job_search.py` | Job search scraper | Searches for job listings |
| `server/model/scraper/proxies.json` | Proxy configuration | List of proxies for web scraping |
| `server/model/scraper/scraper.py` | Main scraper implementation | Core scraping functionality |
| `server/model/scraper/skills_used.json` | Skills data | Database of recognized skills |

### Server Model - Output Formatting

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/model/output_stat/formatter.py` | Output formatting | Formats analysis results |

## Neural Network

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/NeuralNetwork/dockerfile` | Docker configuration for NN | Container setup for neural network |
| `server/NeuralNetwork/querey.py` | Query handling for NN | Processes queries to the neural network |

### Neural Network Data

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/NeuralNetwork/data/0e70eacb1849fe953fb8668c3a86f9bed1f18276c3668013b3410014c4b8d291.json` | Cached data | Specific data cache for processing |
| `server/NeuralNetwork/data/data.json` | Core data | Main dataset for neural network |
| `server/NeuralNetwork/data/gendata.json` | Generated data | Synthetically created data |
| `server/NeuralNetwork/data/gendata2.json` | Secondary generated data | Additional synthetic data |
| `server/NeuralNetwork/data/job_sentences.json` | Job descriptions | Tokenized job description data |
| `server/NeuralNetwork/data/job_title.json` | Job titles | Dataset of job titles |
| `server/NeuralNetwork/data/linkedin_skills.txt` | LinkedIn skills | Skills data from LinkedIn |
| `server/NeuralNetwork/data/merge_data.py` | Data merging utility | Combines multiple data sources |
| `server/NeuralNetwork/data/processed_skills.csv` | Processed skills | Cleaned and processed skills data |
| `server/NeuralNetwork/data/spacy_training_data.json` | spaCy training data | Training data for NLP models |
| `server/NeuralNetwork/data/temp.json` | Temporary data | Temporary storage during processing |
| `server/NeuralNetwork/data/testing.py` | Data testing script | Tests data integrity and format |

### Neural Network Models

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/NeuralNetwork/models/trained_ner_model/` | Named Entity Recognition model | Trained model for identifying entities |
| `server/NeuralNetwork/models/trained_ner_model_best/` | Best NER model | High-performing version of NER model |

### Neural Network Training

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/NeuralNetwork/training/test.py` | Test script | Testing utilities for model training |
| `server/NeuralNetwork/training/train_spacy_ner.py` | NER training script | Trains the Named Entity Recognition model |
| `server/NeuralNetwork/training/training_pipe.py` | Training pipeline script | End-to-end training process |

### Neural Network Testing

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/NeuralNetwork/testing/test_spacy_ner.py` | NER testing script | Tests the NER model performance |

### Neural Network Output Data

| File/Directory | Description | Relationships |
|----------------|-------------|--------------|
| `server/NeuralNetwork/output_data/spacy_training_data.json` | Training output | Output from training process for spaCy |