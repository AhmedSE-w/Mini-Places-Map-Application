# Mini Places Map Application

## Description
A simple map app where you can see places, filter them by category,
add a new place by clicking on the map, and search for nearby places.

## Tech Stack
- Git
- PostgreSQL + PostGIS
- Node.js + Express + Sequelize
- REST
- React
- Leaflet / React-Leaflet + OpenStreetMap
- GeoJSON
- Python (for seeding data)

## User Stories
- I want to see all places on the map when I open the app.
- I want to click a marker to see its name and category.
- I want to filter places by category.
- I want to click on the map and add a new place.
- I want to search for places near a location.

## Setup

### Seed Script
1. cd scripts
2. pip install psycopg2-binary python-dotenv
3. Create a .env file (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
4. python seed.py

### Backend
1. cd backend
2. npm install
3. Create a .env file (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
4. node app.js

### Frontend
1. cd frontend
2. npm install
3. npm run dev
4. Open http://localhost:5173

## Demo Video
https://drive.google.com/file/d/1mvl6p5OfuVntHrhtYWhS2q7t_irEuITY/view?usp=sharing