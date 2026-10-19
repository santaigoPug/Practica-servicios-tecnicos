from flask import Blueprint, jsonify, request
from ..config.conexion import conectar
clientes_bp = Blueprint("clientes", __name__)
@clientes_bp.route("/api/clientes", methods=["GET"])
def obtener_clientes():
   conexion = conectar()
   if conexion is None:
    return jsonify({"success": False, "message": "No se pudo conectar a la base de datos"}),
   500
   cursor = None
   try:
     cursor = conexion.cursor(dictionary=True)
     cursor.execute("SELECT * FROM cliente")
     clientes = cursor.fetchall()
     return jsonify({"success": True, "clientes": clientes}),200
   except Exception as e:
    return jsonify({"success": False, "message": str(e)}), 500
   finally:
     if cursor:
         cursor.close()
   conexion.close()
@clientes_bp.route("/api/clientes", methods=["POST"])
def crear_cliente():
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
         return jsonify({"success": False, "message": "JSON válido requerido"}), 400
    nombre = datos.get("nombre")
    if not isinstance(nombre, str) or not nombre.strip():
         return jsonify({"success": False, "message": "El nombre es obligatorio"}), 400
    conexion = conectar()
    if conexion is None:
         return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
         cursor = conexion.cursor()
         cursor.execute("INSERT INTO cliente (nombre) VALUES (%s)", (nombre.strip(),))
         conexion.commit()
         return jsonify({"success": True, "message": "Cliente creado",
              "id": cursor.lastrowid}), 201
    except Exception as e:
         conexion.rollback()
         return jsonify({"success": False, "message": str(e)}), 500
    finally:
         if cursor:
             cursor.close()
         conexion.close()
@clientes_bp.route("/api/clientes/<int:cliente_id>", methods=["DELETE"])
def eliminar_cliente(cliente_id):
    conexion = conectar()
    if conexion is None:
         return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
      cursor = conexion.cursor()
      cursor.execute("DELETE FROM cliente WHERE id=%s", (cliente_id,))
      conexion.commit()
      if cursor.rowcount == 0:
         return jsonify({"success": False, "message": "Cliente no encontrado"}), 404
      return jsonify({"success": True, "message": "Cliente eliminado"}), 200
    except Exception as e:
      conexion.rollback()
      return jsonify({"success": False, "message": str(e)}), 500
    finally:
      if cursor: cursor.close()
      conexion.close()
@clientes_bp.route("/api/clientes/<int:cliente_id>", methods=["PUT"])
def actualizar_cliente(cliente_id):
   datos = request.get_json(silent=True)
   if not isinstance(datos, dict):
     return jsonify({"success": False, "message": "JSON válido requerido"}), 400
   nombre = datos.get("nombre")
   if not isinstance(nombre, str) or not nombre.strip():
     return jsonify({"success": False, "message": "El nombre es obligatorio"}), 400
   conexion = conectar()
   if conexion is None:
     return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
   cursor = None
   try:
     cursor = conexion.cursor()
     cursor.execute("UPDATE cliente SET nombre=%s WHERE id=%s",
            (nombre.strip(), cliente_id))
     conexion.commit()
     if cursor.rowcount == 0:
         return jsonify({"success": False, "message": "No encontrado o sin cambios"}), 404
     return jsonify({"success": True, "message": "Cliente actualizado"}), 200
   except Exception as e:
      conexion.rollback()
      return jsonify({"success": False, "message": str(e)}), 500
   finally:
          if cursor: cursor.close()
          conexion.close()