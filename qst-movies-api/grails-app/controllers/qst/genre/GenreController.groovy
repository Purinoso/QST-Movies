package qst.genre

import grails.converters.JSON

class GenreController {
    GenreService genreService

    def ajaxGetGenres() {
        Genre[] genre = genreService.getGenres()
        render genre as JSON
    }
}