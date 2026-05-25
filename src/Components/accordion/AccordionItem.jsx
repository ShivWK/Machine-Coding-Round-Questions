import { useEffect, useState, useRef } from 'react';
import "./accordion.css";

const AccordionItem = ({ item, onClick, isOpen }) => {
    return (
        <div className='accordion__item'>
            <button className='accordion__item-title' onClick={onClick}>
                <span>{item.title}</span>
                <span>&#8964;</span>
            </button>
            <AnimatedContent isOpen={isOpen}>
                {item.content}
            </AnimatedContent>
        </div>
    )
}

const AnimatedContent = ({ isOpen, children }) => {
    const [height, setHeight] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (!containerRef.current) return;
            setHeight(containerRef.current.scrollHeight)
        } else {
            setHeight(0);
        }
    }, [isOpen])

    return <div className='accordion__item-content' style={{ height: height }}>
        <div ref={containerRef}>
            <p className='accordion__item-description'>{children}</p>
        </div>
    </div>
}

export default AccordionItem