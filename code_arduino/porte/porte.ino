#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

// Définir les broches utilisées pour le module RC522
#define SS_PIN 10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN); // Instance de l'objet RFID

// Définir les broches pour les composants
#define SERVO_PIN 6
#define BUZZER_PIN 7
#define LED_ROUGE 8
#define LED_VERTE 4

Servo servo;  // Créer une instance de la classe Servo

// Fonction pour générer un son plus fort sur le buzzer
void activerBuzzer(int duree, int frequence) {
  for (int i = 0; i < duree * 1000 / (2 * frequence); i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delayMicroseconds(1000000 / frequence);
    digitalWrite(BUZZER_PIN, LOW);
    delayMicroseconds(1000000 / frequence);
  }
}

// Fonction pour ouvrir la porte
void ouvrirPorte() {
  Serial.println("Ouverture de la porte...");
  activerBuzzer(500, 3000); // Son aigu pour l'ouverture
  digitalWrite(LED_VERTE, HIGH); // Allumer la LED verte
  servo.write(90);               // Ouvrir la porte (servo à 90°)
  delay(5000);                   // Attendre 5 secondes (porte ouverte)
  digitalWrite(BUZZER_PIN, LOW); // Éteindre le buzzer
}

// Fonction pour fermer la porte
void fermerPorte() {
  Serial.println("Fermeture de la porte...");
  servo.write(0);                // Fermer la porte (servo à 0°)
  digitalWrite(LED_VERTE, LOW);  // Éteindre la LED verte
}

// Initialisation
void setup() {
  Serial.begin(9600);        // Démarrer la communication série
  SPI.begin();               // Initialiser le bus SPI
  rfid.PCD_Init();           // Initialiser le module RC522
  servo.attach(SERVO_PIN);   // Attacher le servo à la broche définie
  servo.write(0);            // Position initiale (porte fermée)

  // Initialiser les broches des LEDs et du buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_ROUGE, OUTPUT);
  pinMode(LED_VERTE, OUTPUT);

  // Éteindre les LEDs et le buzzer au démarrage
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_ROUGE, LOW);
  digitalWrite(LED_VERTE, LOW);

  Serial.println("Scanner RFID prêt. Approchez une carte...");
}

// Boucle principale
void loop() {
  // Vérifier si une commande arrive via le port série
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n'); // Lire la commande
    if (command == "OPEN") {
      ouvrirPorte();  // Ouvrir la porte
    } else if (command == "CLOSE") {
      fermerPorte();  // Fermer la porte
    }
  }

  // Vérifier si une carte est présente
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  // Afficher l'UID de la carte
  Serial.print("Carte détectée avec UID : ");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i], HEX);
    Serial.print(" ");
  }
  Serial.println();

  // Identifier et afficher le type de carte
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.print("Type de carte : ");
  Serial.println(rfid.PICC_GetTypeName(piccType));

  // Construire l'UID en format texte
  String cardId = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    cardId += String(rfid.uid.uidByte[i], HEX);
  }
  Serial.print("{\"type\":\"cardRead\",\"cardId\":\"");
  Serial.print(cardId);
  Serial.println("\"}");

  // Ouvrir la porte (servo à 90°)
  ouvrirPorte();

  // Refermer la porte (servo à 0°)
  fermerPorte();

  // Arrêter la communication avec la carte
  rfid.PICC_HaltA();
}
