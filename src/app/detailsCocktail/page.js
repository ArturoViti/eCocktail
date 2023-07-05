"use client"

import React, { useEffect, useState } from 'react';
import styles from  "../../assets/css/cocktail.module.css";
import axios from "axios";
import {Col, Container, Row, Spinner, Image, Button} from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import 'bootstrap/dist/css/bootstrap.min.css';

const URL_DRINK_BASE = "https://www.thecocktaildb.com/api/json/v1/1/";

const DetailCocktail = () => {
    const [ dataDrinks, setDrinks ]  = useState( [] );
    const [ isRandomCocktail, setRandomCocktail ] = useState(false);

    const getDrinksById = async() => {
        const whatDrink = ( new URLSearchParams( window.location.search ) ).get('idDrink')
        const whatUrl = ( parseInt(whatDrink) === -1 ) ? (URL_DRINK_BASE + "random.php")
            : (URL_DRINK_BASE + "lookup.php?i=" + whatDrink);
        const response = await axios.get( whatUrl );

        setRandomCocktail( ( parseInt(whatDrink) === -1 ) );
        setDrinks( response.data.drinks[0] );
    }

    const goToIngredientInfo = ( ingredientName ) => {
        window.open('https://www.google.it/search?q=' + ingredientName, '_blank');
    }

    useEffect(() => { getDrinksById().then( r => {} ); }, [] );

    return (
        (dataDrinks.length === 0) ? ( <Spinner className={styles.loader} animation="border" variant="primary" /> ) : (
            <div className={styles.detailsContainer} style={{ position: "relative", marginTop: "5rem" }}>
                <div className={styles.photoTagContainer}>
                    <img className={styles.photoDrink} src={dataDrinks.strDrinkThumb} alt="fotoDrink" />
                    <div style={{marginTop: "1rem", fontSize: "larger"}} >
                        <Stack direction="horizontal" gap={4} className={styles.stackBadge}>
                            <Badge className={styles.Badge} pill bg="primary">{dataDrinks.strCategory}</Badge>
                            <Badge className={styles.Badge} pill bg="success">{dataDrinks.strIBA}</Badge>
                            <Badge className={styles.Badge} pill bg="info">{dataDrinks.strGlass}</Badge>
                            <Badge className={styles.Badge} pill  bg="danger">{dataDrinks.strAlcoholic}</Badge>
                        </Stack>
                    </div>
                    {
                        (isRandomCocktail) ?
                            <Button variant="primary" onClick={() => window.location.reload()}
                                    className={styles.randomDrinkButton}>
                                Genera un altro Cocktail
                            </Button>
                        : <> </>
                    }
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.headerTitle}>
                        <h1> {dataDrinks.strDrink} </h1>
                    </div>
                    <div>
                        <ul>
                            {
                                ( dataDrinks.strInstructionsIT ) ??
                                    dataDrinks.strInstructionsIT.split("\r\n").map( (step, index) => (
                                        <li key={index} style={{ marginBottom: "1rem"}}> {step} </li>
                                    ))
                            }
                        </ul>
                        <hr />
                    </div>
                    <Container>
                        <Row style={{ justifyContent: "center" }}>
                        {
                            Object.keys(dataDrinks).reduce(
                                (concatenatedIngredients, key) => {
                                    if ( key.startsWith("strIngredient") && dataDrinks[key] )
                                        return (
                                            <>
                                                { concatenatedIngredients }
                                                <Col xs={6} md={4} className={styles.ingrColumn}>
                                                    <div className={styles.photoIngredient}
                                                         onClick={() => goToIngredientInfo(dataDrinks[key])}>
                                                    <Image
                                                        src={"https://www.thecocktaildb.com/images/ingredients/"+
                                                            dataDrinks[key] + "-Small.png" }
                                                        rounded />
                                                    <h5 className={styles.ingrName}> {dataDrinks[key]} </h5>
                                                    </div>
                                                </Col>
                                            </>
                                        );
                                    else
                                        return concatenatedIngredients;
                                },
                                "" )
                        }
                        </Row>
                    </Container>
                </div>
            </div>
        )
    );

};
export default DetailCocktail;