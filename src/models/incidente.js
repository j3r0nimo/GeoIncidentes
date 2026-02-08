import mongoose from "mongoose";

const incidenteSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date, // mejor usar Date para operaciones posteriores
      required: true,
    },
    hora: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Validación HH:mm
    },
    incidente: {
      type: String,
      enum: [
        "choque",
        "detencion",
        "incendio",
        "incidente",
        "secuestro",
        "vuelco",
      ],
      required: true,
    },
    medio: {
      type: String,
      enum: [
        "automovil",
        "bicicleta",
        "camion",
        "cuatriciclo",
        "motocicleta",
        "omnibus",
        "remolque",
      ],
      required: true,
    },
    vehiculo: {
      type: String,
      default: null,
    },
    patente: {
      type: String,
      default: null,
    },
    heridos: {
      type: Number,
      required: true,
    },
    fallecidos: {
      type: Number,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      enum: [
        "Bahia Blanca.",
        "BNPB.",
        "Centro. Punta Alta.",
        "Ciudad Atlantida. Punta Alta.",
        "Nueva Bahia Blanca. Punta Alta.",
        "Pehuenco.",
        "RP 113.",
        "RN 229.",
        "RN 249.",
        "RN 3.",
        "Rural.",
        "Villa Arias.",
        "Villa del Mar.",
        "Villa Mora - Villa Laura. Punta Alta.",
        "Zona Norte. Punta Alta.",
      ],
      required: true,
    },
    lugar: {
      type: String,
      enum: ["calle", "esquina", "ruta"],
      required: true,
    },
    posicion: {
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      required: true,
    },
    imagen: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    web: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Incidente = mongoose.model("Incidente", incidenteSchema);
export default Incidente;
