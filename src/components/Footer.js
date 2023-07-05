'use client'

import styles from "../assets/css/footer.module.css";
import Link from "next/link";
import { useState } from "react";
import {SocialIcon} from "react-social-icons";

export default function Footer() {

    return (
        <div className={styles.footerContainer}>
            <div>
                <h5> © Arturo Viti </h5>
                <h5> <i>Progetto in Next.JS </i> </h5>
            </div>
            <div className={styles.socialContainer}>
                <SocialIcon url="https://www.linkedin.com/in/arturo-viti-a426bb174/" />
                <SocialIcon url="https://www.instagram.com/vitiarturo/" />
                <SocialIcon url="https://github.com/ArturoViti" />
            </div>
        </div>
    );
}