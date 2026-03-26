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
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [setCache, getCache] = useCache("suggestion", 3600)

  const containerRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Even if the listener is attached once, the referenced DOM node can become null later due to unmounting or re-renders, so I guard access inside the handler.
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setIsEmpty(false)
        setSuggestionsError(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

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

  console.log(searchedData);

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
          onKeyDown={handleKeydown}

          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="suggestions-list"
          aria-activedescendant={selectedIndex !== -1 ? `option-${selectedIndex}` : undefined}
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
              : <Search aria-hidden="true" size={20} />
          }
        </button>
      </form>

      {
        ((suggestions.length || suggestionsError || suggestionLoading || isEmpty) && showSuggestions) && <div className="autocomplete__suggestions-wrapper">
          {
            suggestionsError && (
              <div role="status" aria-live="polite" className="suggestions-status">
                <p>{suggestionsError}</p>
              </div>
            )}

          {
            suggestionLoading &&
            <div role="status" aria-live="polite" className="suggestions-status">
              <p>Loading suggestion...</p>
            </div>
          }
          {
            isEmpty &&
            <div role="status" aria-live="polite" className="suggestions-status">
              <p>No result</p>
            </div>
          }

          {
            suggestions.length > 0 &&
            <div
              id="suggestions-list"
              role="listBox"
            >
              <Suggestion
                data={suggestions}
                dataKey={dataKey}
                onSelect={selectHandler}
                highlight={searchTerm}
                selectedIndex={selectedIndex}
              />
            </div>
          }
        </div>
      }
    </div>
  )
}

export default AutoComplete;

// why u get error of uncontrolled to controlled when initial value is null and the u assign a proper value to the state