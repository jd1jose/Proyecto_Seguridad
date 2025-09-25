from flask_cors import CORS
import mysql.connector, bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from datetime import date
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = "clavesesion"  # 🔑 Clave para firmar tokens
jwt = JWTManager(app)

# Configuración de la base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'admin123',
    'database': 'BD_GYM',

}

# ------------------ PING ------------------
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

# ------------------ REGISTRO ------------------
@app.route("/registrar", methods=["POST"])
def crear_usuario():
    data = request.get_json()

    password_bytes = data["password"].encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    query = """
        INSERT INTO Usuario (nombre, apellido, fecha_nacimiento, genero, correo_electronico, telefono, rol, contrasena)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data["nombre"], data["apellido"], data["fechaNacimiento"],
        data["genero"], data["email"], data.get("telefono", None),
        data["rol"], hashed_password.decode('utf-8')
    )

    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"mensaje": "Usuario registrado correctamente"}), 201

# ------------------ LOGIN ------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json.get("credentials", {})
    email = data.get("email")
    password = data.get("password")

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Usuario WHERE correo_electronico = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        if not bcrypt.checkpw(password.encode("utf-8"), user["contrasena"].encode("utf-8")):
            return jsonify({"message": "Contraseña incorrecta"}), 401

        #token = create_access_token(identity=user["id"])  # Guardamos el id del usuario en el token
        token = create_access_token(identity=str(user["id"]))

        return jsonify({"token": token, "rol": user["rol"]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ RUTA PROTEGIDA ------------------
@app.route("/api/protegido", methods=["GET"])
@jwt_required()
def protegido():
    id_usuario = get_jwt_identity()
    return jsonify({"message": f"Hola usuario {id_usuario}, accediste a zona protegida"}), 200

# ------------------ SALUD ------------------
@app.route('/health/data', methods=['POST'])
@jwt_required()
def guardar_datos_salud():
    conn = None
    cursor = None
    try:
        # Usuario autenticado (del token JWT)
        id_usuario = int(get_jwt_identity())  
        data = request.json
        print(data)
        peso = data.get("peso")
        altura = data.get("altura")
        condicion = "--"   # asegúrate que tu frontend mande este campo
        actividad_fisica = data.get("actividad")
        imc = data.get("imc")
        fecha_toma = date.today()

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = """
            INSERT INTO avance_medico 
            (peso, altura, condicion, actividad_fisica, imc, id_usuario, fecha_toma)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (peso, altura, condicion, actividad_fisica, imc, id_usuario, fecha_toma)
        print("values---",values)
        cursor.execute(sql, values)
        conn.commit()

        return jsonify({"message": "✅ Datos de salud guardados correctamente"}), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/health/last', methods=['GET'])
@jwt_required()
def obtener_ultimo_avance():
    conn = None
    cursor = None
    try:
        id_usuario = int(get_jwt_identity())
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT * FROM avance_medico 
            WHERE id_usuario = %s
            ORDER BY fecha_toma DESC, id DESC
            LIMIT 1
        """, (id_usuario,))
        ultimo = cursor.fetchone()

        return jsonify(ultimo if ultimo else {}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route("/ejercicios", methods=["GET"])
@jwt_required()  # si quieres que solo usuarios logueados accedan
def obtener_ejercicios():
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, nombre, descripcion FROM ejercicio")
        ejercicios = cursor.fetchall()

        return jsonify(ejercicios), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route("/ejercicio/crear", methods=["POST"])
@jwt_required()  # opcional, si solo quieres que entrenadores/admin puedan crear ejercicios
def agregar_ejercicio():
    conn = None
    cursor = None
    try:
        data = request.get_json()
        nombre = data.get("nombre")
        descripcion = data.get("descripcion", None)  # opcional

        if not nombre or nombre.strip() == "":
            return jsonify({"error": "El nombre del ejercicio es requerido"}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = "INSERT INTO ejercicio (nombre, descripcion) VALUES (%s, %s)"
        values = (nombre, descripcion)
        cursor.execute(sql, values)
        conn.commit()

        # Obtener el ID insertado
        nuevo_id = cursor.lastrowid

        return jsonify({
            "id": nuevo_id,
            "nombre": nombre,
            "descripcion": descripcion
        }), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

from datetime import date

from datetime import date

@app.route("/crear/rutinas", methods=["POST"])
@jwt_required()  # opcional: solo usuarios logueados pueden crear rutinas
def crear_rutina():
    conn = None
    cursor = None
    try:
        data = request.get_json()
        nombre_rutina = data.get("nombreRutina")
        rutinas = data.get("rutinas", [])

        if not nombre_rutina or not rutinas:
            return jsonify({"error": "Debe ingresar un nombre de rutina y al menos un ejercicio"}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # 1️⃣ Insertar rutina
        sql_rutina = "INSERT INTO rutina_preescrita (nombre, fecha_creacion) VALUES (%s, %s)"
        cursor.execute(sql_rutina, (nombre_rutina, date.today()))
        id_rutina = cursor.lastrowid

        # 2️⃣ Insertar ejercicios relacionados
        sql_detalle = """
            INSERT INTO rutina_preescrita_ejercicio (id_rutina_preescrita, id_ejercicio, series, repeticiones)
            VALUES (%s, %s, %s, %s)
        """
        for r in rutinas:
            ejercicio = r.get("ejercicio", {})
            id_ejercicio = ejercicio.get("id")

            if not id_ejercicio:
                return jsonify({"error": "Cada rutina debe incluir un id de ejercicio válido"}), 400

            cursor.execute(sql_detalle, (
                id_rutina,
                id_ejercicio,
                r.get("series"),
                r.get("repeticiones")
            ))

        conn.commit()

        return jsonify({
            "idRutina": id_rutina,
            "nombreRutina": nombre_rutina,
            "rutinas": rutinas
        }), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route("/usuarios/clientes", methods=["GET"])
@jwt_required()  # opcional si solo entrenadores/admin consultan
def obtener_clientes():
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT id, nombre, apellido, correo_electronico FROM usuario WHERE rol = 2 AND estado = 1"
        cursor.execute(sql)
        clientes = cursor.fetchall()

        return jsonify(clientes), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route("/rutinas/preescritas", methods=["GET"])
@jwt_required()  # opcional si solo entrenadores/admin consultan
def obtener_rutinas():
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, nombre, fecha_creacion FROM rutina_preescrita")
        rutinas = cursor.fetchall()

        return jsonify(rutinas), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/asignar/rutina", methods=["POST"])
def asignar_rutina():
    conn = None
    cursor = None
    try:
        data = request.json
        id_usuario = data.get("idUsuario")
        id_preescrita = data.get("idPreescrita")
        

        if not id_usuario or not id_preescrita:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = """
            INSERT INTO Asignacion_Rutina (idPreescrita, idUsuario)
            VALUES (%s, %s)
        """
        values = (id_preescrita, id_usuario)

        cursor.execute(sql, values)
        conn.commit()

        return jsonify({"message": "✅ Rutina asignada correctamente"}), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route("/usuario/ejercicios", methods=["GET"])
@jwt_required()
def obtener_ejercicios_usuario():
    try:
        # Obtener el usuario autenticado desde el token
        id_usuario = int(get_jwt_identity())

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT e.id, e.nombre, e.descripcion
            FROM asignacion_rutina ar
            INNER JOIN rutina_preescrita rp ON ar.idPreescrita = rp.id
            INNER JOIN rutina_preescrita_ejercicio rpe ON rp.id = rpe.id_rutina_preescrita
            INNER JOIN ejercicio e ON rpe.id_ejercicio = e.id
            WHERE ar.idUsuario = %s
        """
        cursor.execute(query, (id_usuario,))
        ejercicios = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(ejercicios), 200

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
