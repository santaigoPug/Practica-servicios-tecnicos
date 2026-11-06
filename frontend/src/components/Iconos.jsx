const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function IconoClientes() {
  return (
    <svg {...base}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.4c1.9.8 3 2.6 3 5.6" />
    </svg>
  );
}

export function IconoTecnicos() {
  return (
    <svg {...base}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
    </svg>
  );
}

export function IconoServicios() {
  return (
    <svg {...base}>
      <rect x="5" y="4" width="14" height="17" rx="2.5" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
    </svg>
  );
}

export function IconoFlecha() {
  return (
    <svg {...base} width={22} height={22}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconoEstado() {
  return (
    <svg {...base}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}
