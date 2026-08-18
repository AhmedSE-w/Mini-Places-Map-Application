const express = require ('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const placesRoutes = require('./routes/places');

app.use(cors());
app.use(express.json());
app.use(placesRoutes);

sequelize.authenticate()
.then(() => {
  console.log("Database connected successfully!");
})

app.listen(3000, () => {
  console.log("Server is runninig!!")
})