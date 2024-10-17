import express from 'express';
import {getCurrentWeather, getForecastWeather} from "../controllers/weatherController.js";

const router = express.Router();


router.post('/weather', (req, res) => {
    const date = req.body.queryResult.parameters.date;
    if (!date) {
        getCurrentWeather(req, res);
    } else {
        getForecastWeather(req, res);
    }
});


export default router;