import fs from 'fs';
import path from 'path';

export type ImageType = {
    data: Buffer,
    contentType: string,
}

const defaultImagePath = path.join(__dirname, '../../public/images/logo-logement_default.png');
const defaultImageData = fs.readFileSync(defaultImagePath);
export const imageNewsDefault: ImageType = {
    data: defaultImageData,
    contentType: 'image/png',
}