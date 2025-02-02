import {useEffect, useState} from "react";

/** Přidání efektu při události Scroll **/
export function useIntersectionObserver() {

    const [visibleItems, setVisibleItems] = useState([]);

    /** Kontrola, zda se prvek dostal do zorného pole **/
    const handleIntersection = (entry) => {
        if (entry.isIntersecting && !visibleItems.includes(entry.target.id)) {
            setVisibleItems((prev) => [...prev, entry.target.id]);
        }
    };

    /**  Hook, který sleduje viditelnost prvků na stránce pomocí IntersectionObserver **/
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(handleIntersection);
        }, { threshold: 0.5 });

        const items = document.querySelectorAll('.order-item');
        items.forEach((item) => observer.observe(item));

        return () => {
            items.forEach((item) => observer.unobserve(item));
        };
    }, [visibleItems]);

    return visibleItems;
}