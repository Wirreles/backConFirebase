export interface FacturacionI {
    clienteId: string; // Referencia al documento del usuario
    facturasSeleccionadas: string[]; // IDs de las facturas seleccionadas
    pdf: string; // URL del archivo PDF
  }