'use client'

import styles from "../assets/css/navbar.module.css";
import Link from "next/link";
import { useState } from "react";
import useScrollDirection from "@/hooks/useScrollDirection";

export default function NavBar() {
    const [ whatIsClicked, setClicked ] = useState(-1);
    const status = ( useScrollDirection() === "down")  ? "sticky" : "absolute";

    return (
        <div className={styles.navBarContainer} style={{ position: status }}>
            <img src="/images/cocktail.png" alt="logo" className={styles.logo} />
            <Link href="/dashboard"
                    className={ (whatIsClicked === 0) ? styles.activeNavbarElement: styles.navBarElement }
                    onClick={() => setClicked(0)}>
                Esplora
            </Link>
            <Link href="/randomCocktail"
                  className={ (whatIsClicked === 1) ? styles.activeNavbarElement: styles.navBarElement }
                  onClick={() => setClicked(1)}>
                Cocktail Casuale
            </Link>
            <Link href="/profile"
                  className={ (whatIsClicked === 2) ? styles.activeNavbarElement: styles.navBarElement }
                  onClick={() => setClicked(2)}>
                I tuoi Cocktail
            </Link>
        </div>
    );
}