import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerClientes, obtenerServicios, obtenerTecnicos } from "../services/api";
import Layout from "../components/Layout";
import { IconoClientes, IconoFlecha, IconoServicios, IconoTecnicos } from "../components/Iconos";

import { claseEstado } from "../utils/estados";

const ESTADOS = [
  { nombre: "Pendiente", tono: "tono-pendiente" },
  { nombre: "En proceso", tono: "tono-proceso" },
  { nombre: "Finalizado", tono: "tono-finalizado" },
  { nombre: "Cancelado", tono: "tono-cancelado" },
];

function Dashboard() {
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [c, t, s] = await Promise.all([obtenerClientes(), obtenerTecnicos(), obtenerServicios()]);
        if (!activo) return;
        setClientes(c.ok && c.datos.success ? c.datos.clientes || [] : []);
        setTecnicos(t.ok && t.datos.success ? t.datos.tecnicos || [] : []);
        setServicios(s.ok && s.datos.success ? s.datos.servicios || [] : []);
      } catch {
        if (activo) setError("No se pudo conectar con el servidor.");
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  const conteoEstados = useMemo(
    () => ESTADOS.map((e) => ({ ...e, total: servicios.filter((s) => s.estado === e.nombre).length })),
    [servicios],
  );
  const recientes = useMemo(
    () => [...servicios].sort((a, b) => b.id - a.id).slice(0, 5),
    [servicios],
  );
  const abiertos = conteoEstados[0].total + conteoEstados[1].total;
  const valor = (n) => (cargando ? "–" : n);

  return (
    <Layout>
      {error && <p className="aviso" role="status">{error}</p>}
      <div className="bento">
        <section className="tile tile-acento bienvenida span-6 fila-2">
          <span className="tile-etiqueta">Panel principal</span>
          <h1>Hola, {usuario?.username}</h1>
          <p>
            {cargando
              ? "Cargando tu resumen…"
              : `Tienes ${abiertos} ${abiertos === 1 ? "servicio abierto" : "servicios abiertos"} entre pendientes y en proceso.`}
          </p>
          <div className="acciones" style={{ marginTop: "auto" }}>
            <Link to="/servicios" className="btn" style={{ textDecoration: "none", display: "inline-grid", placeItems: "center" }}>
              Registrar servicio
            </Link>
          </div>
        </section>

        <section className="tile span-3">
          <div className="tile-encabezado">
            <span className="tile-etiqueta">Clientes</span>
            <span className="tile-icono"><IconoClientes /></span>
          </div>
          <p className="stat-numero">{valor(clientes.length)}</p>
          <p className="stat-detalle">registrados</p>
        </section>

        <section className="tile span-3">
          <div className="tile-encabezado">
            <span className="tile-etiqueta">Técnicos</span>
            <span className="tile-icono"><IconoTecnicos /></span>
          </div>
          <p className="stat-numero">{valor(tecnicos.length)}</p>
          <p className="stat-detalle">disponibles</p>
        </section>

        <section className="tile tile-oscuro span-6">
          <div className="tile-encabezado">
            <div>
              <span className="tile-etiqueta">Servicios</span>
              <h2>{valor(servicios.length)} en total</h2>
            </div>
            <span className="tile-icono"><IconoServicios /></span>
          </div>
          <ul className="estados">
            {conteoEstados.map((estado) => {
              const porcentaje = servicios.length ? Math.round((estado.total / servicios.length) * 100) : 0;
              return (
                <li className="estado-fila" key={estado.nombre}>
                  <span>{estado.nombre}</span>
                  <strong>{estado.total}</strong>
                  <div className="barra" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <span className={estado.tono} style={{ width: `${porcentaje}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="tile span-8 fila-2">
          <div className="tile-encabezado">
            <h2>Últimos servicios</h2>
            <Link to="/servicios" className="btn btn-secundario btn-chico" style={{ textDecoration: "none" }}>Ver todos</Link>
          </div>
          {recientes.length === 0 ? (
            <p className="lista-vacia">{cargando ? "Cargando…" : "Aún no hay servicios registrados."}</p>
          ) : (
            <ul className="lista">
              {recientes.map((servicio) => (
                <li className="lista-item" key={servicio.id}>
                  <div className="lista-item-cuerpo">
                    <span className="lista-item-titulo">{servicio.descripcion}</span>
                    <span className="lista-item-sub">{servicio.cliente} · {servicio.tecnico}</span>
                  </div>
                  <span className={claseEstado(servicio.estado)}>{servicio.estado}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link to="/clientes" className="tile tile-soft acceso span-4">
          <span className="tile-icono"><IconoClientes /></span>
          <div className="tile-encabezado" style={{ alignItems: "flex-end" }}>
            <div>
              <h2>Clientes</h2>
              <p className="stat-detalle">Altas, cambios y bajas</p>
            </div>
            <span className="acceso-flecha"><IconoFlecha /></span>
          </div>
        </Link>

        <Link to="/tecnicos" className="tile tile-soft acceso span-4">
          <span className="tile-icono"><IconoTecnicos /></span>
          <div className="tile-encabezado" style={{ alignItems: "flex-end" }}>
            <div>
              <h2>Técnicos</h2>
              <p className="stat-detalle">Equipo y especialidades</p>
            </div>
            <span className="acceso-flecha"><IconoFlecha /></span>
          </div>
        </Link>
      </div>
    </Layout>
  );
}

export default Dashboard;
