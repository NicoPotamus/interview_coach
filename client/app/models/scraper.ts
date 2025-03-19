import type { DataEnvelope, DataListEnvelope } from './dataEnvelope'
import { api } from './myFetch'

export async function searchJob(jobTitle: string, jobLocation: string) {
  return api<DataListEnvelope<String>>(`/api/v1/webscraper?job=${jobTitle}&location=${jobLocation}`)
}