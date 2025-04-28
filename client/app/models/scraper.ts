import type { DataEnvelope, DataListEnvelope, } from './dataEnvelope'
import { api } from './myFetch'

export interface skillStat {
  skill: string;
  frequency: number;
}

export default function searchJob(jobTitle: string, jobLocation?: string) {
  const location = jobLocation && jobLocation.trim() !== '' ? jobLocation : 'USA';
  return api<skillStat[]>(`/api/v1/webscraper?job=${jobTitle}&location=${location}`)
    .then((response) => {
      return response; // Handle the resolved value here
    })
    .catch((error) => {
      console.error('Error fetching job data:', error);
      throw error;
    });
}

export function parseUrl(jobUrl: string) {
  jobUrl = jobUrl.trim();
  if (jobUrl === '') {
    return null;
  }
  
  return api<skillStat[]>(`api/v1/urlParser?url=${jobUrl}`)
    .then((response) => {
      return response; // Handle the resolved value here
    })
    .catch((error) => {
      console.error('Error fetching job data:', error);
      throw error;
    });
}

export function quereyModel(description: string){
  description = description.trim();
  if (description === '') {
    return null;
  }
  
  return api<skillStat[]>(`api/v1/query?description=${description}`)
    .then((response) => {
      return response; // Handle the resolved value here
    })
    .catch((error) => {
      console.error('Error fetching job data:', error);
      throw error;
    });
}
