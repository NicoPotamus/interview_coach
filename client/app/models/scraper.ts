import type { DataEnvelope, DataListEnvelope } from './dataEnvelope'
import { api } from './myFetch'

export default function searchJob(jobTitle: string, jobLocation: string) {
  return api<DataListEnvelope<String>>(`/api/v1/webscraper?job=${jobTitle}&location=${jobLocation}`)
    .then((response) => {
      return response; // Handle the resolved value here
    })
    .catch((error) => {
      console.error('Error fetching job data:', error); // Handle errors here
      throw error; // Re-throw the error if needed
    });
}