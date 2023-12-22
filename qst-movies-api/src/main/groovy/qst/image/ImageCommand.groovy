package qst.image

import java.util.Base64
import grails.validation.Validateable

class ImageCommand implements Validateable {    
    Long id
    Long version

    String format
    String name
    byte[] data
    
    static constraints = {
        id nullable: true
        version nullable: true
        format nullable: false
        name nullable: false
        data nullable: false
    }

    static ImageCommand fromRequestData(Map requestData) {
        byte[] data = Base64.getDecoder().decode(requestData.data)

        ImageCommand imageCommand = new ImageCommand(
            format: requestData.format,
            name: requestData.name,
            data: data
        )

        return imageCommand
    }
}