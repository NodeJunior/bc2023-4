const http = require('http');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Ігнорування запитів для favicon.ico
    if (req.url === '/favicon.ico') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    } else {
        // Зчитування вміст файлу 'data.xml'
        fs.readFile('data.xml', 'utf-8', (err, data) => {
            if (err) {
                // Обробка помилки, якщо читання файлу невдале
                console.error('Failed to read XML file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                // Парсинг XML-даних за допомогою XMLParser
                const parser = new XMLParser();
                const xmlData = parser.parse(data);

                // Фільтрація XML-даних за потрібними умовами
                const xmlFilteredData = xmlData.indicators.inflation
                .filter(indicators => indicators.ku === 13 && parseFloat(indicators.value) > 5.0)
                .map(indicator => indicator.value);


                // Побудова відповіді у форматі XML за допомогою XMLBuilder
                const builder = new XMLBuilder();
                const xmlResponse = builder.build({
                    indicators: { inflation: xmlFilteredData }
                });

                // Надсилання XML-відповідь клієнту
                res.writeHead(200, { 'Content-Type': 'application/xml' });
                res.end(xmlResponse);
            }
        });
    }
});

// Налаштовання сервера на прослуховування вказаного порту та хосту
const port = 8000;
const host = "localhost";
server.listen(port, host, () => {
    console.log(`The server has started at http://${host}:${port}`);
});