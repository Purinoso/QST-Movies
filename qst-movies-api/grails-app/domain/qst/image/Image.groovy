package qst.image

import qst.movie.Movie

class Image {
    String format
    String name
    byte[] data

    static constraints = {
        format nullable: false
        name nullable: false
        data nullable: false
    }
}