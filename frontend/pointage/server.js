const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

const port = new SerialPort({
  path: '/dev/ttyACM0', // Remplacez par le port série correct pour l'Arduino
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
      // Ignorer l'erreur de parsing sans afficher
      // Rien à afficher ni à faire ici
    }
  });

  ws.on('message', (message) => {
    try {
      const command = JSON.parse(message);
      if (command.type === 'doorControl') {
        const action = command.action;
        console.log(`Commande reçue : ${action}`);
        // Envoyer la commande à l'Arduino pour ouvrir/fermer la porte
        if (action === 'open') {
          port.write('OPEN\n');
        } else if (action === 'close') {
          port.write('CLOSE\n');
        }
      }
    } catch (error) {
      // Ignorer l'erreur de parsing ici aussi
    }
  });

  ws.on('close', () => {
    console.log('Client déconnecté');
  });
});

console.log('Serveur WebSocket en écoute sur le port 8081');
