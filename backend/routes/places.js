const places = require('express').Router();
const PlacesController = require('../controllers/places');

places.get('/places', PlacesController.index);

places.post('/places', PlacesController.create);

places.get('/places/nearby', PlacesController.nearby);

places.get('/places/:id', PlacesController.show);


module.exports = places;