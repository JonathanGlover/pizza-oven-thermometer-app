#include <SoftwareSerial.h>
#include "Theremocouple.h";
#include "NoDelay.h";

#define PROBE1_CSK 13
#define PROBE1_CS 12
#define PROBE1_SO 11

#define PROBE2_CSK 7
#define PROBE2_CS 6
#define PROBE2_SO 5

#define BT_TX_PIN 3
#define BT_RX_PIN 2

void updateTemp(); 

SoftwareSerial BT(BT_RX_PIN, BT_TX_PIN);

Thermocouple probe1("PROBE1", PROBE1_CSK, PROBE1_CS, PROBE1_SO);
Thermocouple probe2("PROBE2", PROBE2_CSK, PROBE2_CS, PROBE2_SO);

noDelay updateTempDelay(2000, updateTemp);

void setup() {
  BT.begin(9600);
  Serial.begin(4800);
  Serial.println("Started");
  delay(100);
}

void loop() {
  handleConsole();
  updateTempDelay.fupdate();
}

void updateTemp() {
  // Send status to BT device
  BT.println(probe1.getResponse() + probe2.getResponse());
  Serial.println(probe1.getResponse() + probe2.getResponse());
}

char c = ' ';
boolean NL = true;
void handleConsole() {
  // Read from the Bluetooth module and send to the Arduino Serial Monitor
  if (BT.available()) {
    c = BT.read();
    Serial.write(c);
  }

  // Read from the Serial Monitor and send to the Bluetooth module
  if (Serial.available()) {
    c = Serial.read();

    // do not send line end characters to the HM-10
    if (c != 10 & c != 13) BT.write(c);

    // Echo the user input to the main window.
    // If there is a new line print the ">" character.
    if (NL) {
      Serial.print("\r\n>");
      NL = false;
    }
    Serial.write(c);
    if (c == 10) { NL = true; }
  }
}