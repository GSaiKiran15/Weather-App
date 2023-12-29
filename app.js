import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const API_KEY = "658e39b4364a5420498170uvi35eb23";

let place;
let latitude;
let longitude;

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  place = req.body.placeName;

  // Fetching Longitude and Latitude Data
  const result = await axios.get(
    `https://geocode.maps.co/search?q=${place}&api_key=${API_KEY}`
  );
  latitude = result.data[0].lat;
  longitude = result.data[0].lon;
  //   console.log(latitude, longitude);

  // Fetching weather of the place
  const weatherResult = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=03d6b2483eefcaf325c81875b39f20b8&units=metric`
  );

  //   console.log(weatherResult.data);
  let data = weatherResult.data;
  let temperature = data.main.temp;
  let feelsLike = data.main.feels_like;
  let minTemp = data.main.temp_min;
  let maxTemp = data.main.temp_max;
  let description = data.weather[0].description;
  let icon = data.weather[0].icon;

  console.log(temperature, feelsLike, minTemp, maxTemp, description);
  res.render("weather.ejs", {
    temperature: temperature,
    feelsLike: feelsLike,
    minTemp: minTemp,
    maxTemp: maxTemp,
    description: description,
    icon: icon,
  });
});

app.listen(3000, () => {
  console.log("Server running in PORT 3000.");
});
