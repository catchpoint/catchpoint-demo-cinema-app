export const getURLParams = () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const genre = params.get('genre');

    return {
        query,
        genre
    };
};