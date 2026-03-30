import { useState } from "react"
import AccordionItem from "./AccordionItem";
import "./accordion.css";

const Accordion = ({ allowMultiple = true }) => {
    const [openIndex, setOpenIndex] = useState([]);

    const data = [
        {
            id: 1,
            title: "What is React?",
            content: "React is a JavaScript library for building UI."
        },
        {
            id: 2,
            title: "What is useState?",
            content: "useState is a React hook to manage state."
        },
        {
            id: 3,
            title: "What is useState?",
            content: "useState is a React hook to manage state."
        },
        {
            id: 4,
            title: "What is useState?",
            content: "useState is a React hook to manage state."
        }
    ];

    const handleToggle = (index) => {
        if (allowMultiple) {
            setOpenIndex(prv => {
                return prv.includes(index)
                    ? prv.filter(itemIndex => itemIndex !== index)
                    : [...prv, index]
            })
        } else {
            setOpenIndex(prv => {
                return prv.includes(index)
                    ? []
                    : [index]
            })
        }
    }

    console.log(openIndex)

    return (
        <div className="accordion">
            {
                data.map((item, index) => <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openIndex.includes(index)}
                    onClick={() => handleToggle(index)}
                />)
            }
        </div>
    )
}

export default Accordion