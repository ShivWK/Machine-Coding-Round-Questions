import { useRef } from "react";

const getCurrentTimeStamp = () => Math.floor(Date.now() / 1000);

const getInitialCache = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) || {}
    } catch {
        return {}
    }
}

const normalize = (query) => query.toLowerCase().trim()

const useCache = (key, expirationTimeInSeconds) => {
    const cache = useRef(getInitialCache());

    const setCache = (query, data) => {
        const normalizedQuery = normalize(query);
        const timeStamp = getCurrentTimeStamp();
        cache.current[normalizedQuery] = { data, timeStamp };

        localStorage.setItem(key, JSON.stringify(cache.current))
    }

    const getCache = (query) => {
        const normalizedQuery = normalize(query);
        const cachedData = cache.current[normalizedQuery];

        if (cachedData) {
            const { data, timeStamp } = cachedData;
            if (getCurrentTimeStamp() - timeStamp < expirationTimeInSeconds) {
                return data;
            } else {
                delete cache.current[normalizedQuery]
                localStorage.setItem(key, JSON.stringify(cache.current))
            }
        }

        return null;
    }

    return [setCache, getCache]
}

export default useCache;