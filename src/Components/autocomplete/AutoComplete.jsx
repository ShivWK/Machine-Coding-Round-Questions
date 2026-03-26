import Suggestion from "./Suggestion";
import "./autocomplete.css";
import { Search, X } from "lucide-react";
import useAutocomplete from "./hooks/useAutocomplete";

const AutoComplete = ({
  placeholder,
  fetchSuggestion,
  dataKey,
  staticData,
  onSelect,
}) => {
  const { searchTerm,
    handleKeydown,
    clearHandler,
    selectHandler,
    submitHandler,
    searchLoading,
    suggestions,
    suggestionLoading,
    suggestionsError,
    isEmpty,
    showSuggestions,
    selectedIndex,
    containerRef,
    setSearchTerm,
    setShowSuggestions } = useAutocomplete({
      fetchSuggestion,
      dataKey,
      staticData,
      onSelect,
    })

  const status = (text) => {
    return <div role="status" aria-live="polite" className="suggestions-status">
      <p>{text}</p>
    </div>
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
          {suggestionsError && status(suggestionsError)}

          {suggestionLoading && status("Loading suggestion...")}
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