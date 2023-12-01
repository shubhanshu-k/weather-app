const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const apiKey = '254def5fb389e017a5fb520538146bf6';
const PORT = 5000; 

app.use(express.json());
app.use(cors());

app.post('/getWeather', async (req, res) => {
  const { cities } = req.body;
  if (!cities || !Array.isArray(cities)) {
    return res.status(400).json({ error: 'Invalid input. Please provide an array of cities.' });
  }

  try {
    const weatherData = await Promise.all(cities.map(async city => {
      const weather = await getWeatherForCity(city);
      return { [city]: weather };
    }));

    const response = {};
    weatherData.forEach(item => {
      const key = Object.keys(item)[0];
      response[key] = item[key];
    });

    res.json({ weather: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

async function getWeatherForCity(city) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(apiUrl);
    return `${response.data.main.temp}°C`;
  } catch (error) {
    return 'N/A';
  }
}

app.listen(PORT, '0.0.0.0', () => { // Ensure to include '0.0.0.0' for broader accessibility
  console.log(`Server is running on port ${PORT}`);
});
