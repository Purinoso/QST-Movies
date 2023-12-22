import Genre from "./genre.interface";

export default interface Movie {
    id: number;
    version: number;
    title: string;
    description: string;
    rating: number;
    duration: string;
    releaseDate: string;
    trailerLink: string;
    imageUrl?: string | null;
    genres: Genre[];
}