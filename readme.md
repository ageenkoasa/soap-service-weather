npm init
npm install
node app.js
http://localhost:8000/weatherService
Body, raw, XML

Задание: 
Сервис должен иметь любой один метод, который принимает любой входной параметр и возвращает
информацию о сущности в формате XML. 
Информация о сущности должна содержать минимум 5 полей. 
Должен быть метод (PUT, POST, DELETE) в зависимости от варианта, который обращается к данным (не
обязательно использовать БД) для обработки данных сущности.

1.  Создать SOAP-сервис для получения информации о погоде по городу. Напишите DELETE-запрос, для
    удаления данных.

Пример запроса POST: 
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://example.com/weatherService">
  <soapenv:Body>
    <web:getWeatherByCity>
      <web:city>Moscow</web:city>
    </web:getWeatherByCity>
  </soapenv:Body>
</soapenv:Envelope>


Пример запроса DELETE: 
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://example.com/weatherService">
  <soapenv:Body>
    <web:deleteWeatherData>
      <web:city>Moscow</web:city>
    </web:deleteWeatherData>
  </soapenv:Body>
</soapenv:Envelope>
