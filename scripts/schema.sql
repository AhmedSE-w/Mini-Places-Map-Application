CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO places (name, category, location) VALUES
('Kingdom Centre', 'landmark', ST_SetSRID(ST_MakePoint(46.6858, 24.7118), 4326)),
('Al Faisaliah Tower', 'landmark', ST_SetSRID(ST_MakePoint(46.6864, 24.6912), 4326));