import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

function safeFilename(originalName: string): string {
  const ext = extname(originalName).toLowerCase().replace(/[^a-z0-9.]/g, '');
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `upload-${uniqueSuffix}${ext}`;
}

export function buildMulterOptions(subfolder = ''): MulterOptions {
  const baseDir = resolve(process.env.UPLOAD_DIR || './uploads');
  const destination = subfolder ? `${baseDir}/${subfolder}` : baseDir;

  return {
    storage: diskStorage({
      destination,
      filename: (req, file, cb) => {
        cb(null, safeFilename(file.originalname));
      },
    }),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            `File type '${file.mimetype}' is not allowed. Allowed types: PDF, images, Word, Excel, text.`,
          ),
          false,
        );
      }
    },
  };
}
