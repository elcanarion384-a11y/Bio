import csv
import sqlite3
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
csv_file = os.path.join(script_dir, "respuestas.csv")
db_file = os.path.join(script_dir, "respuestas.db")
# Conectar SQLite
conn = sqlite3.connect(db_file)
cur = conn.cursor()

# Crear tabla si no existe
cur.execute("""
CREATE TABLE IF NOT EXISTS respuestas (
    iduser INTEGER PRIMARY KEY,
    timestamp TEXT,
    prueba TEXT
)
""")

with open(csv_file, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Inserta o actualiza si iduser ya existe
        cur.execute("""
            INSERT INTO respuestas (iduser, timestamp, prueba)
            VALUES (?, ?, ?)
            ON CONFLICT(iduser) DO UPDATE SET
                timestamp=excluded.timestamp,
                prueba=excluded.prueba
        """, (row["IDUser"], row["Marca temporal"], row["Prueba"]))

conn.commit()
conn.close()

print("Datos importados y actualizados correctamente en SQLite")