from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.login import login_bp
from app.routes.clientes import clientes_bp
from app.routes.tecnicos import tecnicos_bp
app = Flask(__name__)
CORS(app)
app.register_blueprint(clientes_bp)
app.register_blueprint(login_bp)
app.register_blueprint(tecnicos_bp)
@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "API Servicios Técnicos funcionando"
    })

if __name__ == "__main__":
    app.run(debug=True)