package qst.movie

import grails.converters.JSON
import org.springframework.http.HttpStatus

class MovieController {
    def movieService

    private boolean validateCommand(MovieCommand movieCommand) {
        if (movieCommand.hasErrors()) {
            respond status: HttpStatus.BAD_REQUEST, message: "Hubo un error con la solicitud a la base de datos."
            return false
        }

        return true
    }

    def ajaxGetMovies() {
        try {
            println "hola llegué"
            Movie[] movies = movieService.getMovies()
            render movies as JSON
        }
        catch(Exception e) {
            respond status: HttpStatus.NOT_FOUND, message: "No se han encontrado películas."
        }
    }

    def ajaxGetMovie(Long id) {
        try {
            Movie movie = movieService.getMovie(id)
            render movie as JSON
        }
        catch(Exception e) {
            respond status: HttpStatus.NOT_FOUND, message: "No se ha encontrado ninguna película solicitada con ese ID."
        }
    }

    def save(MovieCommand movieCommand) {
        if (validateCommand(movieCommand)) return

        try {
            Movie movie = movieService.save(movieCommand)
            respond movie, [status: HttpStatus.OK]
        }
        catch(Exception e) {
            respond status: HttpStatus.INTERNAL_SERVER_ERROR, message: "Hubo un error al guardar la película."
        }
    }

    def update(MovieCommand movieCommand) {
        if (validateCommand(movieCommand)) return

        try {
            Movie movie = movieService.update(movieCommand)
            respond movie, [status: HttpStatus.OK]
        }
        catch(Exception e) {
            respond status: HttpStatus.INTERNAL_SERVER_ERROR, message: "Hubo un error al actualizar la película."
        }
    }

    def delete(Long id) {
        try {
            Movie movie = movieService.delete(id)
            respond movie, [status: HttpStatus.OK]
        }
        catch(Exception e) {
            respond status: HttpStatus.INTERNAL_SERVER_ERROR, message: "Hubo un error al eliminar la película."
        }
    }
}