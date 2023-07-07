"use client"

import React, {useEffect, useState} from 'react';
import styles from  "../../assets/css/home.module.css";
import { Button, Card, Form, ListGroup, Pagination, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { BsBookmarkStar, BsFillBookmarkStarFill } from "react-icons/bs";
import { getBookmarkedDrinks } from "@/utils/localStorageFunctions"
import { useRouter } from "next/navigation";
import { URL_DRINK_BASE } from "@/utils/constants"


const Page = () => {
    const router = useRouter();

    const [bookMarkedDrinks, setBookMarkedDrinks] = useState([]);
    const [dataBookmarkedDrinks, setDataBookmarkedDrinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     *  Metodo che dato l'idDrink porta alla schermata di dettaglio del drink
     * @param idDrink
     */
    const handleDetailDrink = ( idDrink ) => {
        router.push( '/detailsCocktail?idDrink=' + idDrink );
    };

    /**
     * Metodo di aggiunta/rimozione di drink dal local storage e toggle dello state
     * @param idDrink
     */
    const handleFavoriteDrink = (idDrink) => {
        if ( !bookMarkedDrinks )
        {
            let arrayDrink = [];
            arrayDrink.push(idDrink);
            localStorage.setItem( 'bookmarkedDrinks', JSON.stringify(arrayDrink) );
            setBookMarkedDrinks(arrayDrink);
        }
        else
        {
            let updatedBookMarkedDrinks;
            if ( bookMarkedDrinks.includes(idDrink) )
                updatedBookMarkedDrinks = bookMarkedDrinks.filter((value) => value !== idDrink);
            else
                updatedBookMarkedDrinks = [...bookMarkedDrinks, idDrink];

            setBookMarkedDrinks( updatedBookMarkedDrinks );
            localStorage.setItem( 'bookmarkedDrinks', JSON.stringify(updatedBookMarkedDrinks) );
        }
    };
    const loadDataBookmarkedDrinks = async (bookMarkedDrinks) => {
        setIsLoading(true);
        let tempDataBookmarkedDrinks = [];
        for ( const value of bookMarkedDrinks )
        {
            await axios.get(URL_DRINK_BASE + "lookup.php?i=" + value)
                .then( (result) => { tempDataBookmarkedDrinks.push(result.data.drinks[0]); })
                .catch((error) => {
                    console.log("Errore durante il caricamento del drink:", error);
                });
        }
        setDataBookmarkedDrinks( tempDataBookmarkedDrinks );
        setIsLoading(false);
    };

    useEffect(() => { setBookMarkedDrinks( getBookmarkedDrinks() ); }, []);

    useEffect(() => {
        if ( bookMarkedDrinks && bookMarkedDrinks.length > 0 ) {
            loadDataBookmarkedDrinks(bookMarkedDrinks).then();
        } else {
            setDataBookmarkedDrinks([]);
            setIsLoading(false);
        }
    }, [bookMarkedDrinks]);

    return (
        <div style={{ position: "relative", marginTop: "5rem" }}>
            <div className={styles.headerContainer}>
                <h1 className={styles.headerSearch}> I tuoi Cocktail Preferiti </h1>
            </div>
            <div className={styles.galleryContainer}>
                <div className={styles.drinksContainer}>
                    {
                        (!bookMarkedDrinks || bookMarkedDrinks.length === 0)
                            ? ( <h3> <i> Nessun cocktail tra i preferiti </i></h3> )
                        : !dataBookmarkedDrinks ? ( <Spinner animation="border" variant="primary" /> )
                            : (
                                dataBookmarkedDrinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink))
                                    .map( (drink) => {
                                        return (
                                            <Card style={{ width: '14rem', borderRadius: "var(--mediumRadius)",
                                                boxShadow: "var(--shadow1)" }} key={drink.idDrink}>
                                                <Card.Img variant="top" src={drink.strDrinkThumb}
                                                          style={{borderRadius: "var(--mediumRadius)" }}
                                                />
                                                <Card.ImgOverlay className={styles.overlayImg}>
                                                    <Button variant="primary" key={drink.idDrink}
                                                            style={{ marginTop: "10rem" }}
                                                            onClick={() => handleDetailDrink(drink.idDrink)}>
                                                        Dettagli
                                                    </Button>
                                                    <Button variant="warning" key={drink.idDrink + 100}
                                                            style={{ marginTop: "10rem" }}
                                                            onClick={() => handleFavoriteDrink(drink.idDrink)}>
                                                        { ( bookMarkedDrinks && bookMarkedDrinks.includes(drink.idDrink) ) ?
                                                            <BsFillBookmarkStarFill className={styles.bookMarkIcon} />
                                                            : <BsBookmarkStar className={styles.bookMarkIcon} />
                                                        }
                                                    </Button>

                                                </Card.ImgOverlay>
                                                <Card.Body style={{ display: "flex", flexDirection: "column",
                                                    justifyContent: "flex-start"}} >
                                                    <Card.Title> <b> {drink.strDrink} </b> </Card.Title>
                                                    <ListGroup variant="flush">
                                                        {
                                                            Object.keys(drink).reduce(
                                                                (concatenatedIngredients, key) => {
                                                                    if ( key.startsWith("strIngredient") && drink[key] )
                                                                        return (
                                                                            <>
                                                                                { concatenatedIngredients }
                                                                                <ListGroup.Item style={{
                                                                                    paddingTop: "0.1rem",
                                                                                    paddingBottom: "0.1rem"
                                                                                }}>
                                                                                    {drink[key]}
                                                                                </ListGroup.Item>
                                                                            </>
                                                                        );
                                                                    else
                                                                        return concatenatedIngredients;
                                                                },
                                                                "" )
                                                        }
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>
                                        );
                                    })
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default Page;