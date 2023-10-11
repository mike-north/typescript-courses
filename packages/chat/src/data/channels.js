import { apiCall } from '../utils/networking';

const cachedChannelRecords = {};

export async function getChannelById(id) {
  let cached = cachedChannelRecords[id];
  if (typeof cached !== 'undefined') return await cached;
  cached = cachedChannelRecords[id] = apiCall(`Channels/${id}`);

  return await cached;
}
