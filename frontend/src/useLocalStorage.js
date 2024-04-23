// useLocalStorage.js
import { useState, useEffect } from "react";

export const useLocalStorage = (key, firstValue = null) => {
    const initialValue = localStorage.getItem(key) || firstValue;
    console.log("Stored Token:", initialValue);
    const [item, setItem] = useState(initialValue);
    useEffect(() => {
        if (item === null) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, item);
        }
    }, [key, item]);
    return [item, setItem];
};
