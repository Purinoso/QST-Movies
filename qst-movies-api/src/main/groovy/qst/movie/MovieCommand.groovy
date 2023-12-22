package qst.movie

import org.joda.time.LocalDate
import org.joda.time.LocalTime
import grails.validation.Validateable

class MovieCommand implements Validateable {    
    Long id
    Long version

    String title
    String description
    Float rating
    LocalTime duration
    LocalDate releaseDate
    String trailerLink
    Long[] genreIds
    Long imageId
    
    static constraints = {
        id nullable: true
        version nullable: true
        title nullable: false
        description nullable: false
        rating nullable: false
        duration nullable: false
        releaseDate nullable: false
        trailerLink nullable: false
        image nullable: true
        genreIds nullable: false
        imageId nullable: true
    }

    // Método para crear una instancia de MovieCommand con los datos de la request
    static MovieCommand fromRequestData(Map requestData) {
        try {
            LocalTime duration = LocalTime.parse(requestData.duration)
            LocalDate releaseDate = LocalDate.parse(requestData.releaseDate)

            MovieCommand movieCommand = new MovieCommand(
                title: requestData.title,
                description: requestData.description,
                rating: requestData.rating as Float,
                trailerLink: requestData.trailerLink,
                genreIds: requestData.genreIds as Long[],
                duration: duration,
                releaseDate: releaseDate
            )
            
            if (requestData.id) {
                movieCommand.id = requestData.id as Long
            }
            
            if (requestData.version) {
                movieCommand.version = requestData.version as Long
            }

            return movieCommand
        }
        catch (Exception e) {
            return null
        }
    }
}