import { useEffect, useState, useRef } from 'react';
import "./accordion.css";

const AccordionItem = ({ item, onClick, isOpen }) => {
    return (
        <div className='accordion__item'>
            <button onClick={onClick}>
                {item.title}
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

    return <div style={{
        height: height,
        overflow: "hidden",
        transition: "height .3s ease"
    }}>
        <div ref={containerRef}>
            <p>{children}</p>
        </div>
    </div>
}

export default AccordionItem