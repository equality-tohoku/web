const ele1  = document.getElementById("button")

// const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
// const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"
const SERVICE_UUID = "00001523-1212-efde-1523-785feabcd123"
const CHARACTERISTIC_UUID = "00001524-1212-efde-1523-785feabcd123"

const values = [];

const myChart = new Chart(
  document.getElementById("myChart"),
  {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sample Data',
        data: [18, 12, 6, 9, 12, 3, 9],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      legend: {
        display: false, // 凡例を非表示
      }
    }
  }
);

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

  characteristic.addEventListener('characteristicvaluechanged', event => {
    const value = event.target.value.getInt8(0, true);
    values.push(value)
    if(values.length > 33){
      values.splice(0, 3)
    }
    const labels = []
    for (let index = 0; index < values.length; index++) {
      labels.push("label"+index.toString())
    }
    myChart.data.datasets[0].data = values
    myChart.data.labels = labels
    myChart.update()
    console.log(myChart.update)

    console.log(value);
  });
});
