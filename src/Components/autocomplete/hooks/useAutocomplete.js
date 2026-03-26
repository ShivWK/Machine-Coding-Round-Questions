import { useCallback, useEffect, useRef, useState } from "react";
import useCache from "./useCache.js"

const useAutocomplete = ({
    fetchSuggestion,
    dataKey,
    staticData,
    onSelect,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedData, setSearchedData] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [suggestionLoading, setSuggestionLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState("");
    const [isEmpty, setIsEmpty] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const [setCache, getCache] = useCache("suggestion", 3600)

    const controllerRef = useRef(null);

    useEffect(() => {
        setSelectedIndex(-1)
    }, [suggestions])

    const getSuggestions = useCallback(async (searchTerm) => {
        setSuggestionsError("");
        setIsEmpty(false);

        const cachedResponse = getCache(searchTerm);
        console.log("cache", cachedResponse)
        if (cachedResponse) {
            setSuggestions(cachedResponse);
            return;
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        setSuggestionLoading(true)
        let result;
        try {
            if (staticData) {
                result = staticData.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
            } else {
                result = await fetchSuggestion(searchTerm, controller.signal);
            }

            if (!result.length) {
                setIsEmpty(true);
            } else {
                setSuggestions(result);
                setCache(searchTerm, result)
            }
        } catch (err) {
            console.log(err.name)
            if (err.name !== "AbortError") {
                console.log(err);
                setSuggestionsError("Something went wrong")
            }
        } finally {
            setSuggestionLoading(false)
        }
    }, [fetchSuggestion, staticData, getCache, setCache])

    const submitHandler = async (e) => {
        if (e?.preventDefault) e.preventDefault();

        setSearchLoading(true)
        try {
            const result = await onSelect();
            setSearchedData(result);
        } catch (err) {
            console.log(err);
        } finally {
            setSearchLoading(false)
        }
    }

    const selectHandler = (text, i) => {
        setSearchTerm(text);
        setShowSuggestions(false)
        submitHandler(text);
        setSelectedIndex(i)
    }

    useEffect(() => {
        setSelectedIndex(-1)
        if (searchTerm.length < 2) return;

        const timer = setTimeout(() => getSuggestions(searchTerm), 300);

        return () => {
            clearTimeout(timer);
        }
    }, [searchTerm, getSuggestions])

    const clearHandler = () => {
        setSearchTerm("");
        setSuggestions([]);
        setSuggestionsError("");
        setIsEmpty(false);
    }

    const handleKeydown = (e) => {
        switch (e.key) {
            case "ArrowDown": {
                setSelectedIndex(prv => prv === -1 || prv === suggestions.length - 1 ? 0 : prv + 1)
                break;
            }

            case "ArrowUp": {
                setSelectedIndex(prv => prv === -1 || prv === 0 ? suggestions.length - 1 : prv - 1)
                break;
            }

            case "Enter": {
                if (selectedIndex >= 0) {
                    selectHandler(suggestions[selectedIndex][dataKey], selectedIndex)
                }

                break;
            }

            default:
                break;
        }
    }

    return {
        searchTerm,
        handleKeydown,
        clearHandler,
        selectHandler,
        submitHandler,
        searchedData,
        searchLoading,
        suggestions,
        suggestionLoading,
        suggestionsError,
        isEmpty,
        showSuggestions,
        selectedIndex,
        setSearchTerm,
        setShowSuggestions,
        setSuggestionsError,
        setIsEmpty,
    }
}

export default useAutocomplete;

// why u get error of uncontrolled to controlled when initial value is null and the u assign a proper value to the state