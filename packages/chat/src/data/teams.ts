import { apiCall } from '../utils/networking'

let cachedAllTeamsList: Promise<{}[]>
export async function getAllTeams() {
  if (typeof cachedAllTeamsList === 'undefined')
    cachedAllTeamsList = apiCall('teams')

  return await cachedAllTeamsList
}

const cachedTeamRecords: Record<string, Promise<{}>> = {}

export async function getTeamById(id: string) {
  let cached = cachedTeamRecords[id]
  if (typeof cached === 'undefined')
    cached = cachedTeamRecords[id] = apiCall(`teams/${id}`)
  return await cached
}
