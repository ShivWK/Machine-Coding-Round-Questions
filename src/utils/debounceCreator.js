function debounceCreator(fn, delay = 200) {
    let timer;

    return (...args) => {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export default debounceCreator;