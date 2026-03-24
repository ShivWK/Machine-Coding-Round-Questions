import AutoComplete from "./AutoComplete";
import "./autocomplete.css";

const AutoCompleteParent = () => {

  const fetchSuggestion = async () => {
    // API https://dummyjson.com/recipes/search?q=Mango
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