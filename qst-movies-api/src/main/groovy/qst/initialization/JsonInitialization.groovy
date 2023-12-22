package qst.initialization

import grails.converters.JSON
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter

import qst.genre.Genre
import qst.movie.Movie

class JsonInitialization {
    static def initialize(){
        JSON.registerObjectMarshaller(Genre){
			def returnArray = [:]

            returnArray['id'] = it.id
            returnArray['name'] = it.name

            return returnArray
        }

        JSON.registerObjectMarshaller(Movie){
            DateTimeFormatter timeFormatter = DateTimeFormat.forPattern("HH'h' mm'min'")
            DateTimeFormatter dateFormatter = DateTimeFormat.forPattern("MM/dd/yyyy")

			def returnArray = [:]

            returnArray['id'] = it.id
            returnArray['version'] = it.version
            returnArray['title'] = it.title
            returnArray['description'] = it.description
            returnArray['rating'] = it.rating
            returnArray['duration'] = timeFormatter.print(it.duration)
            returnArray['releaseDate'] = dateFormatter.print(it.releaseDate)
            returnArray['trailerLink'] = it.trailerLink
            returnArray['genres'] = it.genres

            return returnArray
        }
    }
}   