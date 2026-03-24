import { useState } from "react";
import Suggestion from "./Suggestion";
import "./autocomplete.css";
import { X } from "lucide-react";

const AutoComplete = ({
  placeholder,
  fetchSuggestion,
  dataKey,
  customLoading,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false)

  const inputChangeHandler = (e) => {
    const value = e.target.value;
    setSearchTerm(value)
  }

  const clearInputHandler = () => {
    setSearchTerm("");
  }

  return (
    <div className="autocomplete__container">
      <form
        role="search"
        onSubmit={onSelect}
        className="autocomplete__form"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={inputChangeHandler}
          placeholder={placeholder}
          autoComplete="off"
          className="autocomplete__search--input"
        />
        {
          searchTerm && <button
            className="autocomplete__closeBtn"
            aria-label="Clear input"
            type="button"
            onClick={clearInputHandler}
          >
            <X aria-hidden="true" size={22} />
          </button>
        }

      </form>
    </div>
  )
}

export default AutoComplete