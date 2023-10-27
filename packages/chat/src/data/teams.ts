import { isTeam, isTypedArray } from '../type-guards'
import { ITeam } from '../types'
import { apiCall } from '../utils/networking'

let cachedAllTeamsList: Promise<ITeam[]>

export async function getAllTeams(): Promise<ITeam[]> {
  if (typeof cachedAllTeamsList === 'undefined')
    cachedAllTeamsList = apiCall('teams').then((responseData) => {
      if (isTypedArray(responseData, isTeam)) return responseData;
      else throw new Error('Bad API response for /teams')
    })

  return await cachedAllTeamsList
}

const cachedTeamRecords = {}

export async function getTeamById(id: string): Promise<ITeam> {
  let cached = cachedTeamRecords[id]
  if (typeof cached === 'undefined')
    cached = cachedTeamRecords[id] = apiCall(`teams/${id}`)
  return await cached
}
