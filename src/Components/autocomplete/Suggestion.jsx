import { Search } from "lucide-react";
import "./autocomplete.css";

const Suggestion = ({ data, dataKey, onSelect, highlight }) => {

  const highLightPart = (suggestion, highlight) => {
    const parts = suggestion.split(new RegExp(`(${highlight})`, "gi"))

    return <span>
      {
        parts.map((text, i) => {
          return text.toLowerCase() === highlight.toLowerCase()
            ? <strong key={i}>{text}</strong>
            : text
        })
      }
    </span>
  }

  return (
    <ul>
      {
        data.map((recipe) => {
          return <li
            tabIndex="0"
            className="autocomplete__suggestion"
            key={recipe.id}
            onMouseDown={() => onSelect(recipe[dataKey])}
          >
            <Search aria-hidden="true" size={15} />
            {highLightPart(recipe[dataKey], highlight)}
          </li>
        })
      }
    </ul>
  )
}

export default Suggestion;