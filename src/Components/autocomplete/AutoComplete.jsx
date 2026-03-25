import { useCallback, useEffect, useState } from "react";
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

  const inputChangeHandler = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }

  const clearInputHandler = () => {
    setSearchTerm("");
  }

  const getSuggestions = useCallback(async (searchTerm) => {
    setSuggestionLoading(true)
    let result;
    try {
      if (staticData) {
        result = staticData.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      } else {
        result = await fetchSuggestion(searchTerm);
      }

      setSuggestions(result);
    } catch (err) {
      console.log(err);
      setSuggestionsError(err.message)
    } finally {
      setSuggestionLoading(false)
    }
  }, [fetchSuggestion, staticData])

  const submitHandler = async () => {
    setSearchLoading(true)
    try {
      const response = await onSelect();
      const result = await response.json();

      setSearchedData(result);
    } catch (err) {
      console.log(err);
    } finally {
      setSearchLoading(false)
    }
  }

  const selectHandler = (text) => {
    setSearchTerm(text);
    submitHandler(text);
  }

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([])
      setSuggestionsError("")
      return;
    }

    const timer = setTimeout(() => getSuggestions(searchTerm), 300);

    return () => {
      clearTimeout(timer);
    }
  }, [searchTerm, getSuggestions])

  console.log("Data", searchedData)

  return (
    <div className="autocomplete__container">
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
          onBlur={() => setShowSuggestions(false)}
        />

        {
          searchTerm && <button
            className="autocomplete__closeBtn"
            aria-label="Clear input"
            type="button"
            onClick={clearInputHandler}
          >
            <X aria-hidden="true" size={20} />
          </button>
        }

        <button
          className="autocomplete__submitBtn"
          aria-label="Search" disabled={searchLoading || suggestionLoading}
        >
          {
            (searchLoading || suggestionLoading)
              ? <span className="autocomplete__search--spinner"></span>
              : <Search size={23} />
          }
        </button>
      </form>

      {
        ((suggestions.length || suggestionsError) && showSuggestions) && <div className="autocomplete__suggestions">
          {suggestionsError && <p>{suggestionsError}</p>}
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