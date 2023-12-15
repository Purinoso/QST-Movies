import Genre from "./genre.interface";

export default interface Movie {
    id: number;
    version: number;
    title: string;
    description: string;
    rating: number;
    duration: string;
    releasedDate: string;
    trailerLink: string;
    image: string;
    genres: Genre[];
}