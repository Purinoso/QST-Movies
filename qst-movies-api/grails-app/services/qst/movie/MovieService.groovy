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

        movieCommand.genreIds.each { genreId ->
            Genre genre = Genre.get(genreId)
            movie.addToGenres(genre)
        }

        movie.save(flush: true, failOnError: true)
        return movie
    }

    public Movie update(MovieCommand movieCommand) {
        Movie movie = Movie.get(movieCommand.id)

        movie.title = movieCommand.title
        movie.description = movieCommand.description
        movie.rating = movieCommand.rating
        movie.releaseDate = movieCommand.releaseDate
        movie.trailerLink = movieCommand.trailerLink
        movie.image = movieCommand.image
        
        Genre[] genres = Genre.findAllByIdInList(movieCommand.genreIds ?: [])
        movie.genres.clear()
        genres.each { genre ->
            movie.addToGenres(genre)
        }

        movie.save(flush: true, failOnError: true)
        return movie
    }

    public Movie delete(Long id) {
        Movie movie = Movie.get(id)

        movie.delete(flush: true, failOnError: true)
        return movie
    }
}