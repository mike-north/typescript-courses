import { apiCall } from '../utils/networking'

const cachedChannelRecords: Record<string, Promise<{}>> = {}

export async function getChannelById(id: string) {
  let cached = cachedChannelRecords[id]
  if (typeof cached !== 'undefined') return await cached
  cached = cachedChannelRecords[id] = apiCall(`Channels/${id}`)

  return await cached
}
