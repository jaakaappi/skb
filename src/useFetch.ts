import axios, { AxiosRequestConfig } from "axios";
import { useState, useCallback, useEffect } from "react";

export const useFetch = <T>(url: string, config: AxiosRequestConfig) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const fetch = useCallback(async () => {
    axios(url, config)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        if (e.response.data?.error) {
          return setError(e.response.data.error);
        }
        return setError(e);
      });
  }, [url, config]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetch();
  }, [fetch]);

  useEffect(() => {
    fetch();
    console.log("fetch");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch };
};
