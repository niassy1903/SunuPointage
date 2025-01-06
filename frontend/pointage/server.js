const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

const port = new SerialPort({
  path: '/dev/ttyUSB0', // Remplacez par le port série correct pour la nouvelle carte Arduino
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

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('Client connecté');

  parser.on('data', (data) => {
    console.log('Données reçues :', data);
    try {
      const message = JSON.parse(data);
      if (message.type === 'cardRead') {
        ws.send(JSON.stringify(message)); // Envoi du message JSON au frontend
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données :', error);
    }
  });

  ws.on('close', () => {
    console.log('Client déconnecté');
  });
});

console.log('Serveur WebSocket en écoute sur le port 8081');
