import { ITeam } from '../types'
import { apiCall } from '../utils/networking'

let cachedAllTeamsList
export async function getAllTeams(): Promise<ITeam[]> {
  if (typeof cachedAllTeamsList === 'undefined')
    cachedAllTeamsList = apiCall('teams')

  return await cachedAllTeamsList
}

const cachedTeamRecords = {}

export async function getTeamById(id: string): Promise<ITeam> {
  let cached = cachedTeamRecords[id]
  if (typeof cached === 'undefined')
    cached = cachedTeamRecords[id] = apiCall(`teams/${id}`)
  return await cached
}
