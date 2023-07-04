import styles from '../assets/css/home.module.css'

export default function Home() {
    return (
        <>
            <div className={styles.landingImageContainer}>
                <div className={styles.overlayLandingPage}>
                    <div className={styles.titleLandingAnimation}> <h1>Esplora </h1></div>
                    <br />
                    <div className={styles.descriptionLandingAnimation}>
                        <h2> Tutti i cocktail che vuoi </h2>
                    </div>
                </div>
            </div>
        </>
    )
}
