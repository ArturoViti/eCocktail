import { useState, useEffect } from "react";
import axios from "axios";


/* Hook personalizzato per fetchare i dati */
const useFetch = (url) => {
    // I dati è vuoto
    const [data, setData] = useState([]);
    // Inizialmente si carica
    const [isLoading, setIsLoading] = useState(true);

    // Al cambio di url, esegui il fetch dei dati
    useEffect( () => {(
        async () => {
            setIsLoading(true);
            try
            {
                const { data } = await axios.get(url);
                setData(data);
                console.log( data );
            }
            catch (error) { console.log(error); }
            setIsLoading(false);
        })();
    }, [url] );

    // Restituisce Caricamento e i dati
    return { data, isLoading };
};

export default useFetch;
