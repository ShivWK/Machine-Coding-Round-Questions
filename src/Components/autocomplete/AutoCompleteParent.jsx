import AutoComplete from "./AutoComplete";
import "./autocomplete.css";

const AutoCompleteParent = () => {

  const fetchSuggestion = async (searchTerm) => {
    try {
      const response = await fetch(`https://dummyjson.com/recipes/search?q=${searchTerm}`)
      const result = await response.json();
      
      return result.recipes;
    } catch (err) {
      throw new Error(err);
    }
  }

  return (
    <div className="autocomplete__parent">
      <AutoComplete
        placeholder={"Enter your search term"}
        fetchSuggestion={fetchSuggestion}
        // staticData={""}
        dataKey={"name"}
        customLoading={<p>Loading...</p>}
        onSelect={(res) => { console.log(res) }}
      />
    </div>
  )
}

export default AutoCompleteParent