import { useState } from 'react';
import "./styles.css";

const NUMBER_OF_STARS = 5;

function StarRatingFull({ value = 0, onChange, count = NUMBER_OF_STARS }) {
  const [clickedValue, setClickedValue] = useState(value - 1);
  const [hoveredValue, setHoveredValue] = useState(-1);

  const stars = new Array(count).fill(0);

  const handleMouseEnter = (index) => {
    setHoveredValue(index);
  }

  const clickHandler = (index) => {
    setClickedValue(index);
    onChange(index + 1);
  }

  return (
    <div className='star-rating-parent'>
      <h1>Star Rating Component</h1>

      <div className="star-rating-container">
        {stars.map((_, index) => {
          let className = "";

          if (index <= clickedValue) {
            className = "active";
          }

          if (index <= hoveredValue) {
            className += " hovered";
          }

          return (
            <button
              key={index}
              aria-label={`Rate ${index + 1} star${index > 0 && "s"}`}
              className={`star ${className}`}
              onClick={() => clickHandler(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => setHoveredValue(-1)}
            >
              &#9733;
            </button>
          )
        })}
      </div>
      <div aria-live="polite">
        <p className='selected-rating'>
          Selected Rating: {clickedValue + 1}
        </p>
      </div>
    </div>
  )
}

export default StarRatingFull;