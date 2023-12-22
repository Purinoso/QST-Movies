package qst.movie

import org.joda.time.LocalDate
import org.joda.time.LocalTime

import qst.genre.Genre
import qst.image.Image

class Movie {
    String title
    String description
    Float rating
    LocalTime duration
    LocalDate releaseDate
    String trailerLink    
    Image image

    static hasMany = [genres: Genre]

    static constraints = {
        title nullable: false
        description nullable: false
        rating nullable: false
        duration nullable: false
        releaseDate nullable: false
        trailerLink nullable: false
        image nullable: true
        genres nullable: true
    }
}