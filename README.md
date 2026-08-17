# Mini Places Map Application

## Description
A web application that displays places on an interactive map. Users can view existing places, filter them by category, add new places by clicking on the map, and search for places near a selected location.


## Tech Stack
- Git
- PostgreSQL + PostGIS
- Node.js + Express + Sequelize
- REST
- React
- Leaflet / React-Leaflet + OpenStreetMap (OSM)
- GeoJSON
- Python (data seeding)


## User Stories
- As a user, I want to see all places on the map when the app loads.
- As a user, I want to select a marker to see the place's name and category.
- As a user, I want to filter places by category.
- As a user, I want to select a point on the map and add a new place.
- As a user, I want to request nearby places around a selected coordinate.


## Setup Instructions


### Running the Seed Script
1. cd scripts
2. pip install psycopg2-binary python-dotenv
3. Create a .env file with DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
4. python seed.py