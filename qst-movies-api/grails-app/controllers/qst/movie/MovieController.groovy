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
        render status: HttpStatus.BAD_REQUEST.value(), text: "There was an error with the database request."
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
            render status: HttpStatus.NOT_FOUND.value(), text: "No movies have been found."
            return
        }

        render movies as JSON
    }

    def ajaxGetMovie(Long id) {
        Movie movie = movieService.getMovie(id)

        if (!movie) {
            render status: HttpStatus.NOT_FOUND.value(), text: "No requested movie with that ID has been found."
            return
        }

        render movie as JSON
    }

    def getImage(Long id) {
        Movie movie = movieService.getMovie(id)
        if (!movie) {
            render status: HttpStatus.NOT_FOUND.value(), text: "No requested movie with that ID has been found."
            return
        }

        Image image = movie.image
        if (!image) {
            render status: HttpStatus.NOT_FOUND.value(), text: "Image not found."
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
            render([message: "Movie saved successfully!"] as JSON)
        }
        catch(Exception e) {
            render status: HttpStatus.INTERNAL_SERVER_ERROR.value(), text: "There was an error saving the movie."
        }
    }

    def update() {
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

            Movie movie = movieService.update(movieCommand)
            render([message: "Movie updated successfully!"] as JSON)
        }
        catch(Exception e) {
            render status: HttpStatus.INTERNAL_SERVER_ERROR.value(), text: "There was an error updating the movie."
        }
    }

    def delete(Long id) {
        try {
            Movie movie = movieService.delete(id)
            render([message: "Movie deleted successfully!"] as JSON)
        }
        catch(Exception e) {
            render status: HttpStatus.INTERNAL_SERVER_ERROR.value(), text: "There was an error deleting the movie."
        }
    }
}