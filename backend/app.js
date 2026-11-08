process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

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