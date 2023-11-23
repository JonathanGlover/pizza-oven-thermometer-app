import "./App.css";

import React, { useEffect, useState } from "react";
import Temperature from "./Chart";

let dataDump = "";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [serial, setSerial] = useState(false);
  const [device, setDevice] = useState(false);
  const [probe1, setProbe1] = useState([]);
  const [probe2, setProbe2] = useState([]);

  const toggleConnectHandler = async () => {
    if (serial && device) {
      device.gatt.disconnect();
      setSerial(false);
      return;
    }

    const serviceUUID = 0xffe0;
    const serialUUID = 0xffe1;

    const device_ = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [serviceUUID],
        },
      ],
    });

    setDevice(device_);

    const server = await device_.gatt.connect();
    const service = await server.getPrimaryService(serviceUUID);

    const serial_ = await service.getCharacteristic(serialUUID);
    await serial_.startNotifications();

    setSerial(serial_);
  };

  const serialEventHandler = (event) => {
    let buffer = event.target.value.buffer;
    let view = new Uint8Array(buffer);
    let decodedMessage = String.fromCharCode.apply(null, view);

    dataDump += decodedMessage;

    const format = (str) => {
      ["\n", "\r", " ", " ", "[", "]"].forEach((val) => {
        str = str.replaceAll(val, "");
      });

      return str;
    };

    while (dataDump.indexOf("]") !== -1) {
      const endCharPos = dataDump.indexOf("]");
      const dataSlice = dataDump.slice(0, endCharPos + 1);
      dataDump = dataDump.replace(dataSlice, "");

      const time = Date.now();
      const key = format(dataSlice.split(",")[0]);
      const value = format(dataSlice.split(",")[1]);

      console.log(key, value, time);

      if (key === "PROBE1") {
        setProbe1([
          ...probe1,
          {
            x: time,
            y: value,
          },
        ]);
      }
      if (key === "PROBE2") {
        setProbe2([
          ...probe2,
          {
            x: time,
            y: value,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    if (!serial) return;
    serial?.addEventListener("characteristicvaluechanged", serialEventHandler);
    return () =>
      serial?.removeEventListener(
        "characteristicvaluechanged",
        serialEventHandler
      );
  });

  return (
    <div className="App">
    
      <div
        style={{
          width: "100%",
          height: "90vh",
          margin: "3em 0",
          textAlign: "center",
        }}
      >
          <h1>Pizza oven temperature</h1>
      

        <button onClick={toggleConnectHandler}>
          {serial ? "Disconnect" : "Connect"}
        </button>

        <Temperature probe1={probe1} probe2={probe2} />
      </div>
    </div>
  );
}

export default App;
