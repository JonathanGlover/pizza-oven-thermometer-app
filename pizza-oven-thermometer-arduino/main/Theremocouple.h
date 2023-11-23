#include "max6675.h"

class Thermocouple {
public:
  int thermoDO;
  int thermoCS;
  int thermoCLK;
  String name;
  MAX6675* thermocouple;

  Thermocouple(String name_, int thermoCLK_, int thermoCS_, int thermoDO_) {
    name = name_;
    thermoCLK = thermoCLK_;
    thermoCS = thermoCS_;
    thermoDO = thermoDO_;

    thermocouple = new MAX6675(thermoCLK, thermoCS, thermoDO);
  }
  int readTemp() {
    return thermocouple->readCelsius();
  }

  String getResponse(){
    return "[" + name + "," + thermocouple->readCelsius() + "]\n";
  }
};