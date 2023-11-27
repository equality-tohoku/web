const ele1  = document.getElementById("button")
const ele2  = document.getElementById("value")

// const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
// const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"
const SERVICE_UUID = "00001523-1212-efde-1523-785feabcd123"
const CHARACTERISTIC_UUID = "00001524-1212-efde-1523-785feabcd123"

ele1.addEventListener('click', async (event) => {
  if(!('bluetooth' in navigator)){
    alert("このブラウザはWeb Bluetooth APIに対応していません")
    return;
  }

  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [SERVICE_UUID]   
  })


  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(SERVICE_UUID)
  const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

  await characteristic.startNotifications()

  ele1.hidden = true
  ele2.hidden = false

  characteristic.addEventListener('characteristicvaluechanged', event => {
    const value = event.target.value.getInt8(0, true);
    ele2.textContent = value
    console.log(value);
  });
});
