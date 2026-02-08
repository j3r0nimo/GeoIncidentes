import multer from "multer"; // multipart/form-data & File upload
import path from "path";
import crypto from "crypto"; // para dar nombres aleatorios a las imagenes
import { logger } from "../utils/logger.js"; // para almacenar subida de archivos indeseados

/*
 * CONFIGURACIÓN DEL ALMACENAMIENTO (nombres de archivo seguros)
 * No se permiten nombres de archivo controlados por el usuario
 * Sin colisiones
 * Sin path traversal (traversal de rutas)
 * Formato predecible
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/img");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

/*
 * VALIDACION DEL TIPO DE ARCHIVO QUE SUBIMOS
 * Queremos que solo se puedan cargar imágenes
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    logger.warn("Upload rechazado: Extension  del archivo.", {
      originalName: file.originalname,
      extension: ext,
      mimetype: file.mimetype,
      ip: req.ip,
      route: req.originalUrl,
      requestId: req.requestId,
    });

    return cb(new Error("Solo se aceptan archivos de tipo imagen"), false);
  }

  if (!file.mimetype.startsWith("image/")) {
    logger.warn("Upload rechazado: Tipo MIME invalido.", {
      originalName: file.originalname,
      extension: ext,
      mimetype: file.mimetype,
      ip: req.ip,
      route: req.originalUrl,
      requestId: req.requestId,
    });

    return cb(new Error("Tipo MIME inválido: no es una imagen"), false);
  }

  // Se acepto el upload en su totalidad
  cb(null, true);
};

/**
 * INSTANCIA MULTER & LIMITES
 * El límite previene contra ataques DoS
 * Si Multer no tiene fileFilter, la API acepta cualquier tipo de archivo
 */
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1300 * 1024, // 1 MB
  },
});

// EN ESTE PUNTO
// Si el archivo es inválido → multer arroja un error & nunca se llama al controlador
// Si el archivo es válido → req.file existe
// Si no hay archivo → req.file es undefined pero el controlador funciona
