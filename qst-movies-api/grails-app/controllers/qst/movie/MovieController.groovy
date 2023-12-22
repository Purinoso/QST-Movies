package qst.movie

import grails.converters.JSON
import org.springframework.http.HttpStatus

import qst.image.Image
import qst.image.ImageService
import qst.image.ImageCommand

class MovieController {
    def movieService
    def imageService

    private badRequest() {
        response.setStatus(HttpStatus.BAD_REQUEST.value())
        response.getWriter().write("There was an error with the database request.")
    }

    private boolean validateCommand(MovieCommand movieCommand) {
        if (movieCommand.hasErrors()) {
            badRequest()
            return false
        }

        return true
    }

    def ajaxGetMovies() {
        Movie[] movies = movieService.getMovies()

        if (!movies) {
            response.setStatus(HttpStatus.NOT_FOUND.value())
            response.getWriter().write("No movies have been found.")
            return
        }

        render movies as JSON
    }

    def ajaxGetMovie(Long id) {
        Movie movie = movieService.getMovie(id)

        if (!movie) {
            response.setStatus(HttpStatus.NOT_FOUND.value())
            response.getWriter().write("No requested movie with that ID has been found.")
            return
        }

        render movie as JSON
    }

    def getImage(Long id) {
        Movie movie = movieService.getMovie(id)
        if (!movie) {
            response.setStatus(HttpStatus.NOT_FOUND.value())
            response.getWriter().write("No requested movie with that ID has been found.")
            return
        }

        Image image = movie.image
        if (!image) {
            response.setStatus(HttpStatus.NOT_FOUND.value())
            response.getWriter().write("Image not found.")
            return
        }
        
        response.setContentType("image/$image.format")
        response.setContentLength(image.data.length)
        response.outputStream << image.data
    }

    def save() {
        def movieCommand = MovieCommand.fromRequestData(request.JSON)

        if (movieCommand instanceof MovieCommand) {
            if (!validateCommand(movieCommand)) return
        } else {
            badRequest()
            return
        }

        try {
            if (request.JSON.image) {
                ImageCommand imageCommand = ImageCommand.fromRequestData(request.JSON.image)
                Image image = imageService.save(imageCommand)

                movieCommand.imageId = image.id
            }

            Movie movie = movieService.save(movieCommand)

            render "Movie saved successfully!"
            return
        }
        catch(Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())
            response.getWriter().write("There was an error saving the movie.")
            return
        }
    }

    def update(MovieCommand movieCommand) {
        if (!validateCommand(movieCommand)) return

        try {
            Movie movie = movieService.update(movieCommand)
            response.setStatus(HttpStatus.OK.value())
        }
        catch(Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())
            response.getWriter().write("There was an error saving the movie.")
        }
    }

    def delete(Long id) {
        try {
            Movie movie = movieService.delete(id)
            render "Movie deleted successfully!"
        }
        catch(Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())
            response.getWriter().write("There was an error deleting the movie.")
        }
    }
}