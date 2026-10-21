from flask import Blueprint, jsonify, request
from ..config.conexion import conectar

servicios_bp = Blueprint("servicios", __name__)
ESTADOS = {"Pendiente", "En proceso", "Finalizado", "Cancelado"}


def _validar(datos):
    if not isinstance(datos, dict):
        return None, "Se requiere un objeto JSON válido"
    descripcion = datos.get("descripcion")
    cliente_id = datos.get("cliente_id")
    tecnico_id = datos.get("tecnico_id")
    estado = datos.get("estado", "Pendiente")
    if not isinstance(descripcion, str) or not descripcion.strip():
        return None, "La descripción es obligatoria"
    try:
        cliente_id = int(cliente_id)
        tecnico_id = int(tecnico_id)
    except (TypeError, ValueError):
        return None, "Selecciona un cliente y un técnico válidos"
    if estado not in ESTADOS:
        return None, "El estado del servicio no es válido"
    return {
        "descripcion": descripcion.strip(),
        "cliente_id": cliente_id,
        "tecnico_id": tecnico_id,
        "estado": estado,
    }, None


@servicios_bp.route("/api/servicios", methods=["GET"])
def obtener_servicios():
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("""
            SELECT s.id, s.descripcion, s.cliente_id, c.nombre AS cliente,
                   s.tecnico_id, t.nombre AS tecnico, s.estado, s.fecha
            FROM servicio s
            JOIN cliente c ON c.id = s.cliente_id
            JOIN tecnico t ON t.id = s.tecnico_id
            ORDER BY s.id DESC
        """)
        return jsonify({"success": True, "servicios": cursor.fetchall()}), 200
    except Exception:
        return jsonify({"success": False, "message": "No se pudieron consultar los servicios"}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()


@servicios_bp.route("/api/servicios", methods=["POST"])
def crear_servicio():
    datos, error = _validar(request.get_json(silent=True))
    if error:
        return jsonify({"success": False, "message": error}), 400
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute(
            "INSERT INTO servicio (descripcion, cliente_id, tecnico_id, estado) VALUES (%s, %s, %s, %s)",
            (datos["descripcion"], datos["cliente_id"], datos["tecnico_id"], datos["estado"]),
        )
        conexion.commit()
        return jsonify({"success": True, "message": "Servicio creado", "id": cursor.lastrowid}), 201
    except Exception:
        conexion.rollback()
        return jsonify({"success": False, "message": "No se pudo crear el servicio; verifica que existan el cliente y el técnico"}), 400
    finally:
        if cursor:
            cursor.close()
        conexion.close()


@servicios_bp.route("/api/servicios/<int:servicio_id>", methods=["PUT"])
def actualizar_servicio(servicio_id):
    datos, error = _validar(request.get_json(silent=True))
    if error:
        return jsonify({"success": False, "message": error}), 400
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute(
            "UPDATE servicio SET descripcion=%s, cliente_id=%s, tecnico_id=%s, estado=%s WHERE id=%s",
            (datos["descripcion"], datos["cliente_id"], datos["tecnico_id"], datos["estado"], servicio_id),
        )
        if cursor.rowcount == 0:
            conexion.rollback()
            return jsonify({"success": False, "message": "Servicio no encontrado o sin cambios"}), 404
        conexion.commit()
        return jsonify({"success": True, "message": "Servicio actualizado"}), 200
    except Exception:
        conexion.rollback()
        return jsonify({"success": False, "message": "No se pudo actualizar el servicio"}), 400
    finally:
        if cursor:
            cursor.close()
        conexion.close()


@servicios_bp.route("/api/servicios/<int:servicio_id>", methods=["DELETE"])
def eliminar_servicio(servicio_id):
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM servicio WHERE id=%s", (servicio_id,))
        if cursor.rowcount == 0:
            conexion.rollback()
            return jsonify({"success": False, "message": "Servicio no encontrado"}), 404
        conexion.commit()
        return jsonify({"success": True, "message": "Servicio eliminado"}), 200
    except Exception:
        conexion.rollback()
        return jsonify({"success": False, "message": "No se pudo eliminar el servicio"}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()
