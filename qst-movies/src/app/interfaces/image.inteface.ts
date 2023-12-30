export default interface Image {
    format: string;
    name: string;
    data: string;
}

export function createImageFromBase64String(name: string, base64String: string): Image | null {
    const match = base64String.match(/^data:image\/([a-zA-Z+]+);base64,(.*)/);

    if (match && match.length === 3) {
      const image: Image = {
        format: match[1],
        name: `${name}.${match[1]}`,
        data: match[2]
      };

      return image;
    } else {
      return null
    }
}