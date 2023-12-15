package qst.movie

import java.time.LocalTime
import java.time.LocalDate

import qst.genre.Genre

class Movie {
    String title
    String description
    Float rating
    LocalTime duration
    LocalDate releasedDate
    String trailerLink
    byte[] image

    static hasMany = [genres: Genre]

    static constraints = {
        title nullable: false
        description nullable: false
        rating nullable: false
        duration nullable: false
        releasedDate nullable: false
        trailerLink nullable: false
        image nullable: true
    }
}