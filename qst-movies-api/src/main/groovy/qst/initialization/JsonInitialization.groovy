package qst.initialization

import grails.converters.JSON
import java.time.format.DateTimeFormatter
import javax.xml.bind.DatatypeConverter

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
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("H'h' m'min'")
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")

			def returnArray = [:]

            returnArray['id'] = it.id
            returnArray['version'] = it.version
            returnArray['title'] = it.title
            returnArray['description'] = it.description
            returnArray['rating'] = it.rating
            returnArray['duration'] = timeFormatter.format(it.duration)
            returnArray['releasedDate'] = dateFormatter.format(it.releasedDate)
            returnArray['trailerLink'] = it.trailerLink
            returnArray['genres'] = it.genres
            returnArray['image'] = DatatypeConverter.printBase64Binary(it.image)

            return returnArray
        }
    }
}