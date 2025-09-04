from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Configuración de la base de datos
db_config = {
    'host': 'localhost',      # Cambia si usas otro servidor
    'user': 'root',           # Tu usuario de MariaDB
    'password': 'admin123',# Tu contraseña
    'database': 'BD_GYM'      # Tu base de datos
}

# Probar conexión
@app.route("/api/ping", methods=["GET"])
def ping():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"status": "ok", "server_time": str(result[0])})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# Endpoint para registrar un usuario
@app.route("/api/usuario", methods=["POST"])
def crear_usuario():
    data = request.get_json()
    nombre = data["nombre"]
    apellido = data["apellido"]
    fecha_nacimiento = data["fecha_nacimiento"]
    genero = data["genero"]
    correo = data["correo_electronico"]
    telefono = data.get("telefono", None)
    rol = data["rol"]
    contrasena = data["contrasena"]  # ⚠️ después se recomienda encriptar con bcrypt

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    query = """
        INSERT INTO Usuario (nombre, apellido, fecha_nacimiento, genero, correo_electronico, telefono, rol, contrasena)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (nombre, apellido, fecha_nacimiento, genero, correo, telefono, rol, contrasena)

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"mensaje": "Usuario registrado correctamente"}), 201

# Endpoint para listar usuarios
@app.route("/api/usuarios", methods=["GET"])
def listar_usuarios():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, nombre, apellido, correo_electronico, rol, estado FROM Usuario")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

