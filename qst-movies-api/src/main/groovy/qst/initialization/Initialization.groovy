package qst.initialization

import java.time.LocalTime
import java.time.LocalDate
import java.nio.file.Files

import qst.genre.Genre
import qst.movie.Movie

class Initialization {
    static def start() {
        println "#########################################################################"
        println "#################### Initializing the QST-Movies API ####################"
        println "#########################################################################"

        initializeGenres()
        initializeMovies()
    }

    private static void initializeGenres() {
        println "Initializing genres..."

        String[] genres = ["Action", "Sci-Fi", "Animation", "Adventure", "Comedy", "Crime", "Drama"]

        genres.each { genre ->
            if (Genre.findByName(genre)) return

            new Genre(name: genre).save(flush: true, failOnError: true)
        }
    }

    private static void initializeMovies() {
        println "Initializing movies..."

        File imageFolderFile = new File("./grails-app/assets/images/movies/")
        def movies = [
            [
                "title": "Avengers: Age of Ultron",
                "description": "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.",
                "rating": 7.3,
                "duration": LocalTime.of(2, 21),
                "genres": [
                    Genre.findByName("Action"),
                    Genre.findByName("Adventure"),
                    Genre.findByName("Sci-Fi")
                ],
                "releasedDate": LocalDate.of(2015, 5, 1),
                "trailerLink": "https://www.youtube.com/watch?v=tmeOjFno6Do",
                "imageName": "avengers.png"
            ],
            [
                "title": "Guardians of the Galaxy",
                "description": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
                "rating": 8.0,
                "duration": LocalTime.of(2, 1),
                "genres": [
                    Genre.findByName("Action"),
                    Genre.findByName("Adventure"),
                    Genre.findByName("Comedy")
                ],
                "releasedDate": LocalDate.of(2014, 8, 1),
                "trailerLink": "https://www.youtube.com/watch?v=d96cjJhvlMA",
                "imageName": "guardians-of-the-galaxy.png"
            ],
            [
                "title": "Knives Out",
                "description": "A detective investigates the death of a patriarch of an eccentric, combative family.",
                "rating": 7.9,
                "duration": LocalTime.of(2, 10),
                "genres": [
                    Genre.findByName("Comedy"),
                    Genre.findByName("Crime"),
                    Genre.findByName("Drama")
                ],
                "releasedDate": LocalDate.of(2019, 11, 27),
                "trailerLink": "https://www.youtube.com/watch?v=qGqiHJTsRkQ",
                "imageName": "knives-out.png"
            ],
            [
                "title": "Spider-Man: Into the Spider-Verse",
                "description": "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
                "rating": 8.4,
                "duration": LocalTime.of(1, 57),
                "genres": [
                    Genre.findByName("Action"),
                    Genre.findByName("Animation"),
                    Genre.findByName("Adventure")
                ],
                "releasedDate": LocalDate.of(2018, 12, 14),
                "trailerLink": "https://www.youtube.com/watch?v=tg52up16eq0",
                "imageName": "spider-man.png"
            ],
            [
                "title": "Tenet",
                "description": "Armed with only one word, Tenet, and fighting for the survival of the entire world, a protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
                "rating": 7.8,
                "duration": LocalTime.of(2, 30),
                "genres": [
                    Genre.findByName("Action"),
                    Genre.findByName("Sci-Fi")
                ],
                "releasedDate": LocalDate.of(2020, 9, 3),
                "trailerLink": "https://www.youtube.com/watch?v=LdOM0x0XDMo",
                "imageName": "tenet.png"
            ]
        ]

        movies.each { movie ->
            if(Movie.findByTitle(movie.title)) return

            File imageFile = new File(imageFolderFile, movie.imageName)
            byte[] imageBytes = Files.readAllBytes(imageFile.toPath())

            Movie newMovie = new Movie(
                title: movie.title,
                description: movie.description,
                rating: movie.rating,
                duration: movie.duration,
                releasedDate: movie.releasedDate,
                trailerLink: movie.trailerLink,
                image: imageBytes
            )

            movie.genres.each { genre ->
                newMovie.addToGenres(genre)
            }
            
            newMovie.save(flush: true, failOnError: true)
        }
    }
}