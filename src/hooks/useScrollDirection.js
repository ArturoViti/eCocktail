import { useEffect, useState } from "react";

export default function useScrollDirection() {
    // Stato della direzione di scroll
    const [scrollDirection, setScrollDirection] = useState(null);

    useEffect(() => {

        let lastScrollY = window.scrollY;
        const updateScrollDirection = () => {
            const scrollY = window.scrollY;
            const direction = scrollY > lastScrollY ? "down" : "up";

            if ( direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5) )
                setScrollDirection(direction);

            lastScrollY = (scrollY > 0) ? scrollY : 0;
        };
        window.addEventListener("scroll", updateScrollDirection );
        return () => { window.removeEventListener("scroll", updateScrollDirection); }

    }, [scrollDirection] );

    return scrollDirection;
};