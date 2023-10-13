import { useState, useEffect } from 'react';
import { PaRequest } from '../../../react-services/pa-request';


interface IPaApiResponse {
  affected_items: { [key: string]: any }[]
  failed_items: { [key: string]: any }[]
  total_affected_items: number
  total_failed_items: number
}

export function useApiRequest(method, path, params): [boolean, IPaApiResponse, (string | undefined)] {
  const [items, setItems] = useState<IPaApiResponse>({ affected_items: [], failed_items: [], total_affected_items: 0, total_failed_items: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  useEffect(() => {
    setLoading(true);
    setError(undefined);
    PaRequest.apiReq(method, path, { params })
      .then(response => {
        setItems(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false)
      })
  }, [path, params]);
  return [loading, items, error];
}
