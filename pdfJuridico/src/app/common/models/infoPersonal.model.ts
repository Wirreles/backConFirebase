export interface InformacionPersonalI {
    nombre: string;
    apellido: string;
    direccion: string;
    otrosDetalles: string;
    pdf: string; // URL del archivo PDF
    usuarioId: string; // Referencia al documento del usuario
  }