import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
  host=os.getenv("DB_HOST"),
  port=os.getenv("DB_PORT"),
  dbname=os.getenv("DB_NAME"),
  user=os.getenv("DB_USER"),
  password=os.getenv("DB_PASSWORD")
)
print("Connect successfully!!")

import random
cur = conn.cursor()

cur.execute("DELETE FROM places;")
conn.commit()
print("Old data cleared.")

categories = ["restaurant", "landmark", "park", "cafe", "shop"]

for i in range(50):
  name = f"Place {i + 1}"
  category = random.choice(categories)
  lat = random.uniform(24.60, 24.80)
  lng = random.uniform(46.60, 46.80)

  cur.execute (
    "INSERT INTO places (name, category, location) VALUES" \
    "(%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))",
    (name, category, lng, lat)
  )
conn.commit()
print("Inserted 50 places successfully.")