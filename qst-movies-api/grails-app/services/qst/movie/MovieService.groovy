package qst.movie

import grails.transaction.Transactional

import qst.genre.Genre
import qst.image.Image
import qst.image.ImageService

@Transactional
class MovieService {
    ImageService imageService

    public Movie[] getMovies() {        
        Movie[] movies = Movie.list()
        return movies
    }

    public Movie getMovie(Long id) {
        Movie movie = Movie.get(id)
        return movie
    }

    public Movie save(MovieCommand movieCommand) {
        Image image = imageService.getImage(movieCommand.imageId)
        
        Movie movie = new Movie(
            title: movieCommand.title,
            description: movieCommand.description,
            rating: movieCommand.rating,
            duration: movieCommand.duration,
            releaseDate: movieCommand.releaseDate,
            trailerLink: movieCommand.trailerLink,
            image: image
        )

        movie.id = movieCommand.id

        movieCommand.genreIds.each { genreId ->
            Genre genre = Genre.get(genreId)
            movie.addToGenres(genre)
        }

        movie.save(flush: true, failOnError: true)
        return movie
    }

    public Movie update(MovieCommand movieCommand) {
        Movie movie = Movie.get(movieCommand.id)

        if (movieCommand.imageId) {
            if (movie.image) {
                Image previousImage = movie.image
                movie.image = null
                imageService.delete(previousImage.id)
            }

            movie.image = imageService.getImage(movieCommand.imageId)
        }

        movie.title = movieCommand.title
        movie.description = movieCommand.description
        movie.rating = movieCommand.rating
        movie.duration = movieCommand.duration
        movie.releaseDate = movieCommand.releaseDate
        movie.trailerLink = movieCommand.trailerLink
        
        movie.genres.clear()
        movieCommand.genreIds.each { genreId ->
            Genre genre = Genre.get(genreId)
            movie.addToGenres(genre)
        }

        movie.save(flush: true, failOnError: true)
        return movie
    }

    public Movie delete(Long id) {
        Movie movie = Movie.get(id)

        if (movie.image) {
            Image movieImage = movie.image
            movie.image = null
            imageService.delete(movieImage.id)
        }

        movie.delete(flush: true, failOnError: true)
        return movie
    }
}