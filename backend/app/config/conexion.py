import os
import mysql.connector
from mysql.connector import Error

HOST = os.getenv("DB_HOST", "localhost")
USER = os.getenv("DB_USER", "root")
PASSWORD = os.getenv("DB_PASSWORD", "")
DATABASE = os.getenv("DB_NAME", "tecnico")


def conectar():
    try:
        conexion = mysql.connector.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
        )
        if conexion.is_connected():
            return conexion
        conexion.close()
    except Error as error:
        # No se devuelve el detalle interno de la conexión al cliente HTTP.
        print(f"Error al conectar a la base de datos: {error}")
    return None
