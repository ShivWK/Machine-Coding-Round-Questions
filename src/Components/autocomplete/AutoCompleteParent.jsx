import AutoComplete from "./AutoComplete";
import "./autocomplete.css";

const AutoCompleteParent = () => {

  const fetchSuggestion = async (searchTerm, signal) => {
    try {
      const response = await fetch(`https://dummyjson.com/recipes/search?q=${searchTerm}`, {
        signal
      })
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong")
      }
      
      return result.recipes;
    } catch (err) {
      if (err.name === "AbortError") throw err;
      throw new Error(err);
    }
  }

  return (
    <div className="autocomplete__parent">
      <AutoComplete
        placeholder={"Enter your search term"}
        fetchSuggestion={fetchSuggestion}
        dataKey={"name"}
        onSelect={(res) => { console.log(res) }}
      />
    </div>
  )
}

export default AutoCompleteParent