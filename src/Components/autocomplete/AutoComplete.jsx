import { useRef, useState } from "react";
import Suggestion from "./Suggestion";
import "./autocomplete.css";
import { Search, X } from "lucide-react";
import debounceCreator from "../../utils/debounceCreator";

const AutoComplete = ({
  placeholder,
  fetchSuggestion,
  dataKey,
  customLoading,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const searchSuggestions = useRef(debounceCreator(getSuggestions, 200))

  const inputChangeHandler = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchSuggestions.current(value);
  }

  const clearInputHandler = () => {
    setSearchTerm("");
  }

  async function getSuggestions(searchTerm) {
    console.log("called")
    setSuggestionLoading(true)
    try {
      const result = await fetchSuggestion(searchTerm);
      setSuggestions(result);
    } catch (err) {
      console.log(err);
    } finally {
      setSuggestionLoading(false)
    }
  }

  console.log("re", suggestions)

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
          placeholder={placeholder + "..."}
          autoComplete="off"
          className={`autocomplete__search--input ${!searchTerm && "margin-right-md"}`}
        />
        {
          searchTerm && <button
            className="autocomplete__closeBtn"
            aria-label="Clear input"
            type="button"
            onClick={clearInputHandler}
          >
            <X aria-hidden="true" size={25} />
          </button>
        }

        <button
          className="autocomplete__submitBtn"
          aria-label="Search" disabled={searchLoading || suggestionLoading}
        >
          {
            (searchLoading || suggestionLoading) ? <span className="autocomplete__search--spinner"></span>
              : <Search size={23} />
          }
        </button>
      </form>

      <div className="autocomplete__suggestions">
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur ducimus aperiam porro doloribus hic distinctio, unde cumque quas, ipsum laboriosam facilis, quos eveniet iure repudiandae error alias magni et eaque autem libero neque illum qui quis nihil. Voluptates quos ab porro excepturi pariatur dicta quod suscipit, quisquam aliquid, rem voluptatem optio esse omnis ullam neque necessitatibus placeat! Repellat corrupti perferendis enim maxime facilis expedita saepe minus vitae dignissimos quam? Possimus iure, soluta voluptatem nisi nesciunt corrupti ad aliquam quod, distinctio dolore suscipit odio. Perspiciatis delectus inventore assumenda facere. Quaerat eos perferendis maxime quidem facilis obcaecati velit animi? Molestiae laborum nostrum sed dolore aliquam temporibus iure dolores, doloribus nisi magnam qui animi officia at excepturi laboriosam accusantium neque aliquid voluptas maiores quasi. Aperiam, quam, minima numquam dicta ullam vero atque quaerat fugiat fugit ipsum beatae commodi eligendi aspernatur pariatur eum! Quasi, voluptates. Corrupti explicabo fuga beatae accusantium, recusandae architecto, facilis voluptas veniam perspiciatis quibusdam, reiciendis expedita sequi quo omnis quas ipsa exercitationem. Ex deleniti temporibus aspernatur obcaecati doloribus, impedit, praesentium quae vel numquam sint in esse voluptatem animi sit unde voluptas repellendus dolore ut alias fugiat ab! Dolorum totam aperiam eos accusantium iusto mollitia necessitatibus, inventore sunt dolores blanditiis reprehenderit sequi nam doloribus nihil eveniet illum consequuntur consectetur recusandae placeat. Nobis ratione debitis suscipit aliquid eveniet ullam libero unde dolorem excepturi eum exercitationem adipisci laudantium, porro qui distinctio at corporis cum eaque? Veniam nemo ea quaerat quisquam inventore! Veritatis perspiciatis ipsa corrupti aspernatur non nisi ratione, repellat beatae quod aperiam laborum tenetur dolorum reiciendis numquam ea, laudantium dicta modi optio earum quibusdam labore magnam eos hic nobis! Sapiente, rerum numquam accusamus doloremque laudantium dolores cupiditate minima nam commodi pariatur tempore, quo laboriosam? Incidunt molestiae inventore ad veritatis? Ea autem beatae aspernatur consequuntur inventore labore, quas officiis deserunt alias libero minus magni. Saepe, nobis suscipit perferendis provident pariatur quae distinctio fugit labore dolore? Dolores, deserunt quidem nobis eos vel harum non quia facilis voluptatem aspernatur eius mollitia iste totam veritatis ipsam, ab sed laboriosam cum tenetur quasi fugiat? Inventore numquam quo dolorem ratione delectus, porro neque ipsa et a pariatur officia aliquam deleniti suscipit recusandae aut quos impedit commodi cupiditate. Culpa possimus corporis veritatis qui expedita. Excepturi in enim nam magni a amet! Voluptas perspiciatis consectetur sed quidem quasi neque eos repellendus, tempore obcaecati quas accusantium odit autem. Hic aspernatur vel rem commodi iusto vitae quaerat esse ad accusantium, autem eius tempora, id temporibus placeat, consectetur inventore tenetur. Harum at unde, quas officiis minus magnam, maxime iure praesentium voluptate deserunt natus nihil earum voluptatibus laborum? Quidem, facere. Magni reiciendis non repellat, nostrum, excepturi voluptatem autem eveniet nemo nesciunt voluptatum deserunt dignissimos aliquam sint amet quo id error! Dolor eaque aspernatur ducimus reprehenderit esse porro. Perferendis assumenda maxime, ducimus placeat voluptatibus vero possimus laborum et debitis in ipsa. Inventore porro praesentium culpa maxime totam voluptatibus velit officia voluptatem nam architecto doloremque vel excepturi eius odio, asperiores, blanditiis molestias temporibus dolore impedit debitis rerum? Dolorum dicta possimus, asperiores excepturi quia quod molestias unde officiis.</p>
      </div>
    </div>
  )
}

export default AutoComplete