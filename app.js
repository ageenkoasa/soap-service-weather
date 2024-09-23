const express = require('express');
const app = express();
const xmlparser = require('express-xml-bodyparser');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

// Моковые данные о погоде
let weatherData = {
    'Moscow': {
        temperature: '10C',
        condition: 'Cloudy',
        humidity: '60%',
        wind: '5km/h',
        pressure: '1015 hPa',
    },
    'New York': {
        temperature: '25C',
        condition: 'Sunny',
        humidity: '50%',
        wind: '10km/h',
        pressure: '1020 hPa',
    },
    'London': {
        temperature: '15C',
        condition: 'Rainy',
        humidity: '80%',
        wind: '7km/h',
        pressure: '1010 hPa',
    },
    'Paris': {
        temperature: '18C',
        condition: 'Partly Cloudy',
        humidity: '55%',
        wind: '12km/h',
        pressure: '1018 hPa',
    },
    'Tokyo': {
        temperature: '22C',
        condition: 'Clear',
        humidity: '65%',
        wind: '8km/h',
        pressure: '1022 hPa',
    },
};

// Middleware для обработки XML
app.use(xmlparser());

// POST запрос для получения информации о погоде
app.post('/weatherService', (req, res) => {
    const rawBody = req.rawBody;
    console.log('Request body:', rawBody);

    if (!rawBody) {
        res.status(400).send('Request body is empty.');
        return;
    }

    const cleanedBody = rawBody.toString().trim();

    xml2js.parseString(cleanedBody, (err, result) => {
        if (err) {
            res.status(400).send('An error occurred while processing input data.');
            return;
        }

        try {
            const city =
                result['soapenv:Envelope']['soapenv:Body'][0]['web:getWeatherByCity'][0][
                    'web:city'
                ][0];
            console.log('City:', city);

            if (!weatherData[city]) {
                res.status(404).send('City not found.');
                return;
            }

            const weatherInfo = weatherData[city];

            const xmlResponseTemplate = fs.readFileSync(
                path.join(__dirname, 'weatherResponseTemplate.xml'),
                'utf8'
            );
            // Создаем XML-ответ, заменяя плейсхолдеры
            const xmlResponse = xmlResponseTemplate
                .replace('${city}', city)
                .replace('${weatherInfo.temperature}', weatherInfo.temperature)
                .replace('${weatherInfo.condition}', weatherInfo.condition)
                .replace('${weatherInfo.humidity}', weatherInfo.humidity)
                .replace('${weatherInfo.wind}', weatherInfo.wind)
                .replace('${weatherInfo.pressure}', weatherInfo.pressure);

            res.set('Content-Type', 'text/xml');
            res.send(xmlResponse);
        } catch (parseError) {
            console.error('Error processing XML structure:', parseError);
            res.status(400).send('An error occurred while processing input data.');
        }
    });
});

// DELETE запрос для удаления данных о погоде
app.delete('/weatherService', (req, res) => {
    const rawBody = req.rawBody;

    if (!rawBody) {
        res.status(400).send('Request body is empty.');
        return;
    }

    const cleanedBody = rawBody.toString().trim();

    xml2js.parseString(cleanedBody, (err, result) => {
        if (err) {
            res.status(400).send('An error occurred while processing input data.');
            return;
        }

        try {
            const city =
                result['soapenv:Envelope']['soapenv:Body'][0]['web:deleteWeatherData'][0][
                    'web:city'
                ][0];
            console.log('City to delete:', city);

            if (weatherData[city]) {
                delete weatherData[city];
                res.set('Content-Type', 'text/xml');
                res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://example.com/weatherService">
                            <soapenv:Body>
                                <web:deleteWeatherDataResponse>
                                    <web:status>Success</web:status>
                                    <web:message>Weather data for ${city} has been deleted.</web:message>
                                </web:deleteWeatherDataResponse>
                            </soapenv:Body>
                        </soapenv:Envelope>`);
            } else {
                res.status(404)
                    .send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://example.com/weatherService">
                                        <soapenv:Body>
                                            <web:deleteWeatherDataResponse>
                                                <web:status>Error</web:status>
                                                <web:message>City not found.</web:message>
                                            </web:deleteWeatherDataResponse>
                                        </soapenv:Body>
                                    </soapenv:Envelope>`);
            }
        } catch (parseError) {
            console.error('Error processing XML structure:', parseError);
            res.status(400).send('An error occurred while processing input data.');
        }
    });
});

// Запуск сервера
app.listen(8000, () => {
    console.log('Starting the server on port 8000');
});
