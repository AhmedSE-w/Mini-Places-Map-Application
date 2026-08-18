const Place = require('../models/place');
const sequelize = require('../config/database');
const {QueryTypes} = require('sequelize');

module.exports = {
  index: (req, res) => {
    Place.findAll()
    .then((places) => {
      res.json(places);
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
  },

  create: (req, res) => {
    Place.create ({
      name: req.body.name,
      category: req.body.category,
      location: {
        type: 'Point',
        coordinates: [req.body.lng, req.body.lat]
      }
    })
    .then((place) => {
      res.status(201).json(place);
    })
    .catch((error) => {
      res.status(400).json({error: error.message})
    })
  },

  show: (req, res) => {
    const id = req.params.id;
    Place.findByPk(id)
    .then((place) => {
      if(!place) {
        res.status(404).json({error: "Place not found"});
      } else {
        res.json(place);
      }
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
  },

  nearby: (req, res) => {
    const {lat, lng, radius} = req.query;

    sequelize.query (
      `SELECT id, name, category, created_at,
      ST_X(location::geometry) AS lng,
      ST_Y(location::geometry) AS lat
      FROM places
      WHERE ST_DWithin (
      location,
      ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
      :radius
      )`,
      {
        replacements: {lat, lng, radius},
        type: QueryTypes.SELECT
      }
    )
    .then((places) => {
      res.json(places);
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
  }


  }

