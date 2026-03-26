import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import "./autocomplete.css";

const Suggestion = ({ data, dataKey, onSelect, highlight, selectedIndex }) => {
  const optionRef = useRef([])

  useEffect(() => {
    if (selectedIndex >= 0 && optionRef.current[selectedIndex]) {
      optionRef.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    }
  }, [selectedIndex])

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
        data.map((recipe, i) => {
          return <li
            ref={(ele) => optionRef.current[i] = ele}
            id={`option-${i}`}
            role="option"
            aria-selected={selectedIndex === i}
            className="autocomplete__suggestion"
            key={recipe.id}
            onClick={() => onSelect(recipe[dataKey], i)}
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