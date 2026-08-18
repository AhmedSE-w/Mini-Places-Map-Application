const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Place = sequelize.define('Place', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
     type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false
     }
  }, {
  tableName: 'places',
  timestamps: false

});

module.exports = Place;
