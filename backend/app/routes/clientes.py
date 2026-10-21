from flask import Blueprint, jsonify, request
from ..config.conexion import conectar

clientes_bp = Blueprint("clientes", __name__)


@clientes_bp.route("/api/clientes", methods=["GET"])
def obtener_clientes():
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "No se pudo conectar a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre FROM cliente ORDER BY id DESC")
        return jsonify({"success": True, "clientes": cursor.fetchall()}), 200
    except Exception:
        return jsonify({"success": False, "message": "No se pudieron consultar los clientes"}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()


@clientes_bp.route("/api/clientes", methods=["POST"])
def crear_cliente():
    datos = request.get_json(silent=True)
    nombre = datos.get("nombre") if isinstance(datos, dict) else None
    if not isinstance(nombre, str) or not nombre.strip():
        return jsonify({"success": False, "message": "El nombre es obligatorio"}), 400
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("INSERT INTO cliente (nombre) VALUES (%s)", (nombre.strip(),))
        conexion.commit()
        return jsonify({"success": True, "message": "Cliente creado", "id": cursor.lastrowid}), 201
    except Exception:
        conexion.rollback()
        return jsonify({"success": False, "message": "No se pudo crear el cliente"}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()


@clientes_bp.route("/api/clientes/<int:cliente_id>", methods=["PUT"])
def actualizar_cliente(cliente_id):
    datos = request.get_json(silent=True)
    nombre = datos.get("nombre") if isinstance(datos, dict) else None
    if not isinstance(nombre, str) or not nombre.strip():
        return jsonify({"success": False, "message": "El nombre es obligatorio"}), 400
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("UPDATE cliente SET nombre=%s WHERE id=%s", (nombre.strip(), cliente_id))
        if cursor.rowcount == 0:
            conexion.rollback()
            return jsonify({"success": False, "message": "Cliente no encontrado o sin cambios"}), 404
        conexion.commit()
        return jsonify({"success": True, "message": "Cliente actualizado"}), 200
    except Exception:
        conexion.rollback()
        return jsonify({"success": False, "message": "No se pudo actualizar el cliente"}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()


@clientes_bp.route("/api/clientes/<int:cliente_id>", methods=["DELETE"])
def eliminar_cliente(cliente_id):
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM cliente WHERE id=%s", (cliente_id,))
        if cursor.rowcount == 0:
            conexion.rollback()
            return jsonify({"success": False, "message": "Cliente no encontrado"}), 404
        conexion.commit()
        return jsonify({"success": True, "message": "Cliente eliminado"}), 200
    except Exception:
        conexion.rollback()
        return jsonify({"success": False, "message": "No se pudo eliminar el cliente"}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()
