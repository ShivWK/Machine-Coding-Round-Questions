import { useCallback, useEffect, useRef, useState } from "react";
import Suggestion from "./Suggestion";
import "./autocomplete.css";
import { Search, X } from "lucide-react";

const AutoComplete = ({
  placeholder,
  fetchSuggestion,
  dataKey,
  staticData,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState("");

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
        setSuggestionsError("No Results")
      }
      setSuggestions(result);
    } catch (err) {
      console.log(err.name)
      if (err.name !== "AbortError") {
        console.log(err);
        setSuggestionsError(err.message)
      }
    } finally {
      setSuggestionLoading(false)
    }
  }, [fetchSuggestion, staticData])

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
    setSuggestionsError("")

    if (searchTerm.length < 2) {
      setSuggestions([])
      return;
    }

    const timer = setTimeout(() => getSuggestions(searchTerm), 300);

    return () => {
      clearTimeout(timer);
    }
  }, [searchTerm, getSuggestions])

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
            onClick={() => setSearchTerm("")}
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
        ((suggestions.length || suggestionsError || suggestionLoading) && showSuggestions) && <div className="autocomplete__suggestions">
          {suggestionsError && <div className="suggestions-loader">
            <p>{suggestionsError}</p>
          </div>}
          {suggestionLoading
            && <div className="suggestions-loader">
              <span>Loading suggestions...</span>
            </div>
          }
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