import { useCallback, useEffect, useRef, useState } from "react";
import Suggestion from "./Suggestion";
import "./autocomplete.css";
import { Search, X } from "lucide-react";
import useCache from "../../hooks/useCache";

const AutoComplete = ({
  placeholder,
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

  const [setCache, getCache] = useCache("suggestion", 3600)

  const containerRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Even if the listener is attached once, the referenced DOM node can become null later due to unmounting or re-renders, so I guard access inside the handler.
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const inputChangeHandler = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }

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
    e.preventDefault();
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

  const selectHandler = (text) => {
    setSearchTerm(text);
    setShowSuggestions(false)
    submitHandler(text);
  }

  useEffect(() => {
    if (searchTerm.length < 2) return;

    const timer = setTimeout(() => getSuggestions(searchTerm), 300);

    return () => {
      clearTimeout(timer);
    }
  }, [searchTerm, getSuggestions])

  const getSuggestionStatus = (text) => {
    return <div className="suggestions-status">
      <p>{text}</p>
    </div>
  }

  console.log(searchedData);

  const clearHandler = () => {
    setSearchTerm("");
    setSuggestions([]);
    setSuggestionsError("");
    setIsEmpty(false);
  }

  return (
    <div ref={containerRef} className="autocomplete__container">
      <form
        role="search"
        onSubmit={submitHandler}
        className="autocomplete__form"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={inputChangeHandler}
          placeholder={placeholder + "..."}
          autoComplete="off"
          className={`autocomplete__search--input ${!searchTerm && "margin-right-md"}`}
          onFocus={() => setShowSuggestions(true)}
        />

        {
          searchTerm && <button
            className="autocomplete__closeBtn"
            aria-label="Clear input"
            type="button"
            onClick={clearHandler}
          >
            <X aria-hidden="true" size={20} />
          </button>
        }

        <button
          className="autocomplete__submitBtn"
          aria-label="Search"
          disabled={searchLoading}
        >
          {
            (searchLoading)
              ? <span className="autocomplete__search--spinner"></span>
              : <Search size={20} />
          }
        </button>
      </form>

      {
        ((suggestions.length || suggestionsError || suggestionLoading || isEmpty) && showSuggestions) && <div className="autocomplete__suggestions">
          {suggestionsError && getSuggestionStatus(suggestionsError)}
          {suggestionLoading && getSuggestionStatus("Loading suggestions...")}
          {isEmpty && getSuggestionStatus("No result")}
          <Suggestion
            data={suggestions}
            dataKey={dataKey}
            onSelect={selectHandler}
            highlight={searchTerm}
          />
        </div>
      }
    </div>
  )
}

export default AutoComplete;

// why u get error of uncontrolled to controlled when initial value is null and the u assign a proper value to the state