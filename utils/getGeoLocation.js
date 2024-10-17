import axios from 'axios';

export const getGeoLocation=async(city)=> {

    try {
        const apiKey = process.env.OPEN_WEATHER_API_KEY;  
        const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

        const response = await axios.get(geoApiUrl);
        const data = response.data;

        if (data.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }
        const { lat, lon } = data[0];
        return {lat, lon};
    } catch (error) {
        console.error('Error fetching geolocation data:', error.message);
        throw error;
    }
};