import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';

/** Funkce pro animaci jednotlivých obrazovek **/
function Transition({Component}) {

    // nastavení viditelnosti efektu
    const [isVisible, setIsVisible] = useState(true);

    // Doba mezi přechody
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (

        <>
            <Component/>

            <motion.div
                className={isVisible ? "slide-out" : "slide-in"}
                initial={{scaleY: 0}}
                animate={{scaleY: isVisible ? 1 : 0}}
                exit={{scaleY: 0}}
                transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
            />

        </>

    );
}

export default Transition;
