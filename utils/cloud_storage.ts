import { Storage } from '@google-cloud/storage';
import { format } from 'util';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: 'delivery-5a80e',
  keyFilename: './service-account-key.json',
});

const bucket = storage.bucket('gs://delivery-5a80e.appspot.com');

export const storageHandler = async (
  file: Express.Multer.File,
  pathImage?: string,
  deletePathImage?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('delete path', deletePathImage);
    if (deletePathImage) {
      if (deletePathImage != null || deletePathImage != undefined) {
        const parseDeletePathImage = new URL(deletePathImage);
        const ulrDelete = parseDeletePathImage.pathname.slice(23);
        const fileDelete = bucket.file(`${ulrDelete}`);

        fileDelete
          .delete()
          .then((imageDelete) => {
            console.log('se borro la imagen con exito');
          })
          .catch((err) => {
            console.log('Failed to remove photo, error:', err);
          });
      }
    }

    if (pathImage) {
      if (pathImage != null || pathImage != undefined) {
        let fileUpload = bucket.file(`${pathImage}`);
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
            },
          },
          resumable: false,
        });

        blobStream.on('error', (error) => {
          console.log('Error al subir archivo a firebase', error);
          reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
          // The public URL can be used to directly access the file via HTTP.
          const url = format(
            `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${
              fileUpload.name
            }?alt=media&token=${uuidv4()}`
          );
          console.log('URL DE CLOUD STORAGE ', url);
          resolve(url);
        });

				blobStream.end(file.buffer);
      }
    }
  });
};

