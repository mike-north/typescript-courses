/* eslint-disable promise/always-return */
import { useEffect } from 'react';
import Deferred from './deferred';

/**
 * 
 * @param {() => Promise} getData 
 * @param {{
    stateName: string;
    otherStatesToMonitor?: unknown[];
    setter: (arg: x) => void;
  }} options 
  @return {void}
 */
export function useAsyncDataEffect(getData, options) {
  let cancelled = false;
  const { setter, stateName } = options;
  useEffect(() => {
    const d = new Deferred();

    getData()
      .then((jsonData) => {
        if (cancelled) return;
        else d.resolve(jsonData);
      })
      .catch(d.reject);

    d.promise
      .then((data) => {
        if (!cancelled) {
          console.info(
            '%c Updating state: ' + stateName,
            'background: green; color: white; display: block;',
          );
          setter(data);
        }
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [...(options.otherStatesToMonitor || []), stateName]);
}
