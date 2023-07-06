/**
 * Metodo che restituisce i cocktail preferiti dal localStorage
 * @returns {any}
 */
export const getBookmarkedDrinks = () => { return JSON.parse( localStorage.getItem('bookmarkedDrinks') ); }