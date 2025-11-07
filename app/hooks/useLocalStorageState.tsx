// Source - https://stackoverflow.com/questions/76070793/localstorage-is-not-defined-in-next-js

import { useEffect, useState } from "react";

// Get/Set a piece of state from local storage
export default function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load
  useEffect(() => {
    const localstorageValue = localStorage.getItem(key);
    // console.log(`loaded ${key} = ${localstorageValue}`);

    if (localstorageValue !== null) {
      setValue(JSON.parse(localstorageValue) as T);
    }
    setIsInitialized(true);
  }, [key]);

  // Save
  useEffect(() => {
    if (isInitialized) {
      // console.log(`saved ${key} = ${value}`);
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [isInitialized, key, value]);

  return [value, setValue] as const;
}
