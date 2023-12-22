package qst.image

import grails.transaction.Transactional

@Transactional
class ImageService {
    public Image save(ImageCommand imageCommand) {
        Image image = new Image(
            format: imageCommand.format,
            name: imageCommand.name,
            data: imageCommand.data
        )

        image.save(flush: true, failOnError: true)
        return image
    }

    public Image getImage(Long id) {
        Image image = Image.get(id)
        return image
    }
}