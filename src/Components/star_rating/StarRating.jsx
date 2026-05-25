import { useState } from 'react';
import "./styles.css";

const NUMBER_OF_STARS = 5;

function StarRating({ value = 0, onChange, count = NUMBER_OF_STARS }) {
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
            <span
              key={index}
              className={`star ${className}`}
              onClick={() => clickHandler(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => setHoveredValue(-1)}
            >
              &#9733;
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default StarRating;