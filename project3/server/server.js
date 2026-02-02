require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:8081"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const weatherRoutes = require("./routes/weather.routes");
const favoritesRoutes = require("./routes/favorites.routes");

app.get("/", (req, res) => {
  res.json({
    message: "Weather App API",
    version: "1.0.0",
    endpoints: {
      weather: "/api/weather/:city",
      favorites: "/api/favorites"
    }
  });
});

app.use("/api/weather", weatherRoutes);
app.use("/api/favorites", favoritesRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Weather API server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}`);
});
