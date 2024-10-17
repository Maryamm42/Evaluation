import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from "./routes/weather.js";

const app = express();
const port = process.env.PORT || 8080;
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api', weatherRoutes);
app.listen(port, ()=>{
    console.log(`Our Weather App Api Server is running on ${port}`);
    console.log('API Key:', process.env.OPEN_WEATHER_API_KEY);
})