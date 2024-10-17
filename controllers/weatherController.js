import { getGeoLocation } from "../utils/getGeoLocation.js";
import axios from 'axios';
import moment from 'moment';

export const getCurrentWeather = async (req, res) => {
    const city  = req.body.queryResult.parameters.city;
    // const {city} = req.query;
    try {
        const geolocation = await getGeoLocation(city);
        if (!geolocation || !geolocation.lat || !geolocation.lon) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        const apiKey = process.env.OPEN_WEATHER_API_KEY; 
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${geolocation.lat}&lon=${geolocation.lon}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        const temperature = (data.main.temp - 273.15).toFixed(1); 
        const description = data.weather[0].description; 

        res.send(JSON.stringify({"fulfillmentText": `The current weather in ${city} is ${temperature}°C with ${description}.`}));
    } catch (error) {
        console.error('Error fetching current weather data:', error.message);
    }
};

export const getForecastWeather = async (req, res) => {
    const { city } = req.body.queryResult.parameters; 

    if (!city) {
        return res.send(JSON.stringify({"fulfillment Text": "Please provide city name."}));
    }

    try {
        const geolocation = await getGeoLocation(city);
        if (!geolocation || !geolocation.lat || !geolocation.lon) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        const apiKey = process.env.OPEN_WEATHER_API_KEY;
        const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${geolocation.lat}&lon=${geolocation.lon}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        const forecastData = response.data.list;

        const forecastByDay = {};
        const currentDate = moment().format('YYYY-MM-DD');

        forecastData.forEach(forecast => {
            const date = moment.unix(forecast.dt).format('YYYY-MM-DD');
            if(date !==currentDate){
                if (!forecastByDay[date]) {
                    forecastByDay[date] = [];
                }
                forecastByDay[date].push(forecast);
            }
        });
       
        const FiveDayForecast = Object.keys(forecastByDay).slice(0, 6).map(date => {
            const daily = forecastByDay[date];
            const midday = daily[Math.floor(daily.length / 2)]; 
            const temperature = (midday.main.temp - 273.15).toFixed(1); 
            const description = midday.weather[0].description;

            return {
                date: moment(date).format('MMMM Do, YYYY'), 
                temperature: `${temperature}°C`,
                description
            };
        });
       
        const forecastMessage = FiveDayForecast.map(day => 
            `On ${day.date}, the weather will be ${day.temperature} with ${day.description}.`
        ).join('\n');

        res.send(JSON.stringify({ fulfillmentText: `The 5-day weather forecast for ${city}:\n${forecastMessage}`}))
    } catch (error) {
        console.error('Error fetching forecast data:', error.message);
    }
};
