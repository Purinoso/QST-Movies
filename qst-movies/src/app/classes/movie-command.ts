import { Time } from "@angular/common";

import Image, { createImageFromBase64String } from '@/interfaces/image.inteface';

export default class MovieCommand {
    public duration: string = '';
    public releaseDate: string = '';
    public image: Image | null = null;

    constructor(
        public version: number = 0,
        public title: string,
        public description: string,
        public rating: number,
        public trailerLink: string,
        public genreIds: number[],
        duration: Time,
        releaseDate: Date,
        imageBase64?: string | null,
        public id?: number
    ) {
        this.duration = `${duration.hours.toString().padStart(2, '0')}:${duration.minutes.toString().padStart(2, '0')}`;
        this.releaseDate = releaseDate.toISOString().split('T')[0];
        if (imageBase64) {
            const imageName = title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            this.image = createImageFromBase64String(imageName, imageBase64);
        }
    }
}