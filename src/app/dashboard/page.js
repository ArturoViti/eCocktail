// noinspection JSUnresolvedVariable

"use client"

import React, {useEffect, useState} from 'react';
import styles from  "../../assets/css/home.module.css";
import {Button, Card, Form, ListGroup, Pagination, Spinner} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { BsBookmarkStar } from "react-icons/bs";
import { useRouter } from "next/navigation";

const URL_TIPOLOGY = "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list";
const URL_GLASS = "https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list";
const URL_INGR = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list";
const URL_ALCHOLIC = "https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list";

let URL_DRINK_BY_LETTER = "https://www.thecocktaildb.com/api/json/v1/1/search.php";

const Explore = () => {
    const router = useRouter();

    const { data: dataTipology, isLoading: isLoadingTipology }  = useFetch(URL_TIPOLOGY);
    const { data: dataGlass, isLoading: isLoadingGlass }  = useFetch(URL_GLASS);
    const { data: dataIngr, isLoading: isLoadingIngr }  = useFetch(URL_INGR);
    const { data: dataAlchol, isLoading: isLoadingAlchol }  = useFetch(URL_ALCHOLIC);

    const [ dataDrinks, setDrinks ]  = useState( [] );
    const [ noCocktailFound, setNoCocktailFound ] = useState(false);

    const [ isSearchedByForm, setSearchByForm ] = useState(false);
    const [ filterItems, setFilterItems ] = useState(null);
    const [ drinkForm, setDrinkForm] = useState({ name: "", category: "", glass: "",
        ingredient: "", typeAlchol: ""
    });

    const [ filterLetter, setFilterLetter ] = useState("A");

    const getDataDrinksByLetter = async ( letter ) => {
        const response = await axios.get( URL_DRINK_BY_LETTER + "?f=" + letter );
        setDrinks( response.data );
    };

    const getDataDrinksByForm = async( drinkForm ) => {
        let url = "";
        if ( drinkForm.name !== "" )
            url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkForm.name;
        else
        {
            url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php"
            let queryParams = [];

            if ( drinkForm.category !== "" )    queryParams.push(`c=${drinkForm.category}`);

            if ( drinkForm.glass !== "" )       queryParams.push(`g=${drinkForm.glass}`);

            if ( drinkForm.ingredient !== "" )  queryParams.push(`i=${drinkForm.ingredient}`);

            if ( drinkForm.typeAlchol !== "" )  queryParams.push(`a=${drinkForm.typeAlchol}`);

            if ( queryParams.length > 0 )
                url += `?${queryParams.join("&")}`;
        }
        console.log(url);
        const response = await axios.get( url );
        setDrinks( response.data );

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDrinkForm({ ...drinkForm, [name]: value });
    };

    function pageClicked( letter ) {
        setSearchByForm(false);
        setFilterLetter( letter.text );
        getDataDrinksByLetter( letter.text ).then( r => {} );
    }

    function handleSearch( event ) {
        event.preventDefault();
        if ( drinkForm.category !== "" || drinkForm.glass !== "" || drinkForm.ingredient !== ""
                || drinkForm.typeAlchol !== "" || drinkForm.name !== "" )
        {
            setFilterLetter( "" );
            setSearchByForm(true);
            getDataDrinksByForm( drinkForm ).then( r => {} );
        }
    }

    function handleDetailDrink( idDrink ) {
        router.push("/detailsCocktail?idDrink=" + idDrink);
    }

    useEffect(() => {
        setFilterLetter( "A" );
        getDataDrinksByLetter("A" ).then( r => {} );
    }, [] );

    useEffect(() => {
        // Se la lista dei coctail è vuota, genero tutti i filtri
        const alpha = Array.from( Array(26) ).map( (e, i) => i + 65 );
        const alphabet = alpha.map( (x) => String.fromCharCode(x) );
        const updatedAlphabet = [];
        updatedAlphabet.push(
            alphabet.map( (letter) => (
            <Pagination.Item key={letter} active={(letter === filterLetter && !isSearchedByForm )}
                    onClick={ (event) => pageClicked(event.target)} >
                {letter}
            </Pagination.Item>
            ))
        );
        setFilterItems( updatedAlphabet );
    }, [dataDrinks] );



    return (
        <div style={{ position: "relative", marginTop: "5rem" }}>
            <div className={styles.headerContainer}>
                <h1 className={styles.headerSearch}> Cerca Cocktail </h1>
                <div className={styles.paginationContainer}>
                    <Pagination style={{marginBottom: 0}}> {filterItems} </Pagination>
                </div>
            </div>
            <div className={styles.formContainer}>
                <Form className={styles.form}>
                    <Form.Group className="mb-2" controlId="cocktailNameContainer">
                        <Form.Label> Nome </Form.Label>
                        <Form.Control type="text" placeholder="Nome..." value={drinkForm.name}
                            onChange={handleChange} name="name"
                            disabled={(drinkForm.category !== "" || drinkForm.glass !== ""
                                || drinkForm.ingredient !== "" || drinkForm.typeAlchol !== "" )}/>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="cocktailTipologyContainer">
                        <Form.Label> Tipologia </Form.Label>
                        <Form.Select value={drinkForm.category}
                                onChange={handleChange} name="category" disabled={(drinkForm.name !== "")} >
                            <option value={""}> Tutti </option>
                            {
                                isLoadingTipology ? ( <> </> )
                                : (
                                    dataTipology.drinks.sort((a, b) => a.strCategory.localeCompare(b.strCategory))
                                        .map( (tipology, index) => {
                                            return (<option key={index} value={tipology.strCategory}>
                                                    {tipology.strCategory} </option>
                                            );
                                        })
                                )
                            }
                        </Form.Select >
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="cocktailGlassContainer">
                        <Form.Label> Bicchiere </Form.Label>
                        <Form.Select value={drinkForm.glass} onChange={handleChange} name="glass"
                                disabled={(drinkForm.name !== "")} >
                            <option value={""}> Tutti </option>
                            {
                                isLoadingGlass ? ( <> </> )
                                    : (
                                        dataGlass.drinks.sort((a, b) => a.strGlass.localeCompare(b.strGlass))
                                            .map( (glass, index) => {
                                                return (<option key={index} value={glass.strGlass}>
                                                        {glass.strGlass} </option>
                                                );
                                            })
                                    )
                            }
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="cocktailIngredientContainer">
                        <Form.Label> Ingredienti </Form.Label>
                        <Form.Select value={drinkForm.ingredient} onChange={handleChange} name="ingredient"
                                disabled={(drinkForm.name !== "")}>
                            <option value={""}> Tutti </option>
                            {
                                isLoadingIngr ? ( <> </> )
                                    : (
                                        dataIngr.drinks.sort((a, b) => a.strIngredient1.localeCompare(b.strIngredient1))
                                            .map( (ingr, index) => {
                                                return (<option key={index} value={ingr.strIngredient1}>
                                                        {ingr.strIngredient1} </option>
                                                );
                                            })
                                    )
                            }
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="cocktailAlcholContainer">
                        <Form.Label> Alcolico </Form.Label>
                        <Form.Select value={drinkForm.typeAlchol} onChange={handleChange} name="typeAlchol"
                                disabled={(drinkForm.name !== "")}>
                            <option value={""}> Tutti </option>
                            {
                                isLoadingAlchol ? ( <> </> )
                                    : (
                                        dataAlchol.drinks.sort((a, b) => a.strAlcoholic.localeCompare(b.strAlcoholic))
                                            .map( (alchol, index) => {
                                                return (
                                                    <option key={index} value={alchol.strAlcoholic}>
                                                        {alchol.strAlcoholic}
                                                    </option>
                                                );
                                            })
                                    )
                            }
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="submitContainer">
                        <Button type="submit" style={{marginTop: "2rem"}}
                                onClick={ (event) => handleSearch(event) }>
                            Cerca
                        </Button>
                    </Form.Group>
                </Form>
            </div>
            <div className={styles.galleryContainer}>
                <div className={styles.drinksContainer}>
                {
                    !dataDrinks.drinks ? ( <Spinner animation="border" variant="primary" /> )
                        : (
                            dataDrinks.drinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink))
                                .map( (drink, index) => {
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
                                                        style={{ marginTop: "10rem" }}>
                                                    <BsBookmarkStar className={styles.bookMarkIcon} />
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
export default Explore;