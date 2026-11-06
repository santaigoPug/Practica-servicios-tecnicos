export const ESTADOS = ["Pendiente", "En proceso", "Finalizado", "Cancelado"];

export const claseEstado = (estado) =>
  `pill pill-${String(estado || "").toLowerCase().replace(/\s+/g, "-")}`;
