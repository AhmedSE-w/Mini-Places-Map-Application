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
    const lat = req.body.lat;
    const lng = req.body.lng;

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({error: "Invalid coordinates"});
    }

    if (!req.body.name || !req.body.category) {
      return res.status(400).json({error: "Name and category are required"});
    }
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
    if (isNaN(id)) {
      return res.status(400).json({error: "Invalid id"});
    }
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
  },

  destroy: (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({error: "Invalid id"});
    }

    Place.destroy({ where: {id: id } })
    .then((deletedCount) => {
      if (deletedCount === 0) {
        res.status(404).json({error: 'Place not found'});
      } else {
        res.status(200).json({message: "Place deleted"});
      }
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
  },

  update: (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({error: "Invalid id"});
    }

    if (!req.body.name || !req.body.category) {
      return res.status(400).json({error: "Name and category are required"});
    }

    Place.update(
      { name: req.body.name, category: req.body.category },
      { where: { id: id } }
    )
    .then(([updateCount]) => {
      if (updateCount === 0) {
        res.status(404).json({error: "Place not found"});
      } else {
        res.status(200).json({message: "Place updated"});
      }
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
  }


  }

