import {useEffect, useState} from "react";

const KEY = '26793674';

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // only called if it exists.
    // callback?.();

    useEffect(
        function () {
            const controller = new AbortController();

            async function fetchMovies() {

                try {
                    setIsLoading(true);
                    setError('');

                    const response =
                        await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal})

                    if (!response.ok) throw new Error('Something went wrong with fetching movies');

                    const data = await response.json();

                    if (data.Response === 'False') {
                        throw new Error('Movies Not Found')
                    }

                    if (query.length < 3) {
                        setMovies([]);
                        setError('');
                        return;
                    }
                    setMovies(data.Search);

                    setError('')
                    // setIsLoading(false);
                } catch (err) {
                    // console.log(err.message);
                    if (err.name !== 'AbortError') {
                        console.log(err.message);
                        setError(err.message)
                    }
                } finally {
                    setIsLoading(false);
                }
            }

            // handleCloseMovie();

            fetchMovies();

            // cleanup and abort api calls
            return function () {
                controller.abort();
            }
        }, [query]
    );

    return { movies, isLoading, error}
}
