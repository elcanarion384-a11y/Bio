import json
import os
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = "0.0.0.0"
PORT = 8000
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "respuestas.db")


def get_respuesta(iduser: int):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(
        "SELECT iduser, timestamp, prueba FROM respuestas WHERE iduser = ?",
        (iduser,),
    )
    row = cur.fetchone()
    conn.close()

    if row is None:
        return None

    return {
        "iduser": row["iduser"],
        "timestamp": row["timestamp"],
        "prueba": row["prueba"],
    }


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = self.path.rstrip("/")

        if path == "":
            self._send_json(200, {"status": "ok", "message": "API activa"})
            return

        prefix = "/respuestas/"
        if not path.startswith(prefix):
            self._send_json(404, {"error": "Ruta no encontrada"})
            return

        raw_id = path[len(prefix) :]
        if not raw_id.isdigit():
            self._send_json(400, {"error": "El iduser debe ser numérico"})
            return

        respuesta = get_respuesta(int(raw_id))
        if respuesta is None:
            self._send_json(404, {"error": "No existe respuesta para ese iduser"})
            return

        self._send_json(200, respuesta)


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"API escuchando en http://{HOST}:{PORT}")
    server.serve_forever()
