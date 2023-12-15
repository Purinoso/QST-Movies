package qst.movie

import grails.converters.JSON
import org.springframework.http.HttpStatus

class MovieController {
    def movieService

    private boolean validateCommand(MovieCommand movieCommand) {
        if (movieCommand.hasErrors()) {
            respond status: HttpStatus.BAD_REQUEST, message: "There was an error with the database request."
            return false
        }

        return true
    }

    def ajaxGetMovies() {
        try {
            Movie[] movies = movieService.getMovies()
            render movies as JSON
        }
        catch(Exception e) {
            respond status: HttpStatus.NOT_FOUND, message: "No movies have been found."
        }
    }

    def getImage(Long movieId) {
        try {
            Movie movie = movieService.getMovie(movieId)
            byte[] image = movie.image

            if (image) {
                response.setContentType("image/png")
                response.setContentLength(image.length)
                response.outputStream << image
            } else {
                respond status: HttpStatus.NOT_FOUND, message: "Image not found."
            }
        } catch(Exception e) {
            respond status: HttpStatus.NOT_FOUND, message: "No requested movie with that ID has been found."
        }
    }

    def ajaxGetMovie(Long id) {
        try {
            Movie movie = movieService.getMovie(id)
            render movie as JSON
        }
        catch(Exception e) {
            respond status: HttpStatus.NOT_FOUND, message: "No requested movie with that ID has been found."
        }
    }

    def save(MovieCommand movieCommand) {
        if (validateCommand(movieCommand)) return

        try {
            Movie movie = movieService.save(movieCommand)
            respond movie, [status: HttpStatus.OK]
        }
        catch(Exception e) {
            respond status: HttpStatus.INTERNAL_SERVER_ERROR, message: "There was an error saving the movie."
        }
    }

    def update(MovieCommand movieCommand) {
        if (validateCommand(movieCommand)) return

        try {
            Movie movie = movieService.update(movieCommand)
            respond movie, [status: HttpStatus.OK]
        }
        catch(Exception e) {
            respond status: HttpStatus.INTERNAL_SERVER_ERROR, message: "There was an error saving the movie."
        }
    }

    def delete(Long id) {
        try {
            Movie movie = movieService.delete(id)
            respond movie, [status: HttpStatus.OK]
        }
        catch(Exception e) {
            respond status: HttpStatus.INTERNAL_SERVER_ERROR, message: "There was an error saving the movie."
        }
    }
}