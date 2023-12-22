package qst.genre

import grails.converters.JSON

class GenreController {
    GenreService genreService

    def ajaxGetGenres() {
        Genre[] genres = genreService.getGenres()

        if (!genres) {
            response.setStatus(HttpStatus.NOT_FOUND.value())
            response.getWriter().write("No genres have been found.")
            return
        }

        render genres as JSON
    }
}