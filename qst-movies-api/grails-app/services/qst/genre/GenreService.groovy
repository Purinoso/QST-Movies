package qst.genre

import grails.transaction.Transactional

@Transactional
class GenreService {
    public Genre[] getGenres() {        
        Genre[] genres = Genre.list()
        return genres
    }
}