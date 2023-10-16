/* eslint-disable promise/always-return */
import { useEffect } from 'react'
import { Deferred } from './deferred'

/**
 * A custom React hook that fetches data asynchronously and updates the state with the result.
 * @param getData - A function that returns a Promise that resolves to the data to be fetched.
 * @param options - An object containing the state name, an optional array of other states to monitor, and a setter function to update the state.
 */
export function useAsyncDataEffect(getData: () => Promise<unknown>, options: {
  stateName: string;
  otherStatesToMonitor?: unknown[];
  setter: (arg: any) => void;
}) {
  let cancelled = false
  const { setter, stateName } = options
  useEffect(() => {
    const d = new Deferred("requesting data")

    getData()
      .then((jsonData) => {
        if (cancelled) return
        else d.resolve(jsonData)
      })
      .catch((err) => d.reject(err))

    d.promise
      .then((data) => {
        if (!cancelled) {
          console.info(
            '%c Updating state: ' + stateName,
            'background: green; color: white; display: block;',
          )
          setter(data)
        }
      })
      .catch(console.error)
    return () => {
      cancelled = true
    }
  }, [...(options.otherStatesToMonitor || []), stateName])
}
