package qst.movie

import java.time.LocalTime
import java.time.LocalDate
import grails.validation.Validateable

class MovieCommand implements Validateable {    
    Long id
    Long version

    String title
    String description
    Float rating
    LocalTime duration
    LocalDate releasedDate
    String trailerLink
    byte[] image
    Long[] genreIds
    
    static constraints = {
        id nullable: true
        version nullable: true
        title nullable: false
        description nullable: false
        rating nullable: false
        duration nullable: false
        releasedDate nullable: false
        trailerLink nullable: false
        image nullable: true
        genreIds nullable: false
    }
}