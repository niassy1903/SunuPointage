const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

const port = new SerialPort({
  path: '/dev/ttyUSB0', // Remplacez par le port série correct
  baudRate: 9600,
}, (err) => {
  if (err) {
    return console.error('Erreur lors de l\'ouverture du port série :', err.message);
  }
});

port.on('error', (err) => {
  console.error('Erreur du port série :', err.message);
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connecté');

  parser.on('data', (data) => {
    console.log('Données reçues :', data);
    ws.send(data); // Envoi de la card_id au frontend
  });

  ws.on('close', () => {
    console.log('Client déconnecté');
  });
});

console.log('Serveur WebSocket en écoute sur le port 8080');
