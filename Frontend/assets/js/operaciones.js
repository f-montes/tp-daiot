//******************************************** */
var TEMPERATURA = 0;
var HUMEDAD = 0;
var SERVER = "192.168.1.39";
var PUERTO = 9001;
var indicador = 0;
var mensaje = "";
// Create a client instance
client = new Paho.MQTT.Client(SERVER, PUERTO, "clientId");

// set callback handlers
client.onConnectionLost = function(responseObject) {
    console.log("Connection Lost: " + responseObject.errorMessage);
}

client.onMessageArrived = function(message) {
    console.log("Message llega: " + message.payloadString);

    var data_json = JSON.parse(message.payloadString);
    TEMPERATURA = Number(data_json.temperatura);
    HUMEDAD = Number(data_json.humedad);
    document.getElementById("humedad").innerHTML = HUMEDAD + "%";
    document.getElementById("temperatura").innerHTML = TEMPERATURA + "°";


    var hoy = new Date();
    var time = hoy.getHours() + " : " + hoy.getMinutes() + " : " + hoy.getSeconds() + " : " + hoy.getMilliseconds()
    mensaje = mensaje + time + " << " + message.payloadString + "\n";
    document.getElementById("mensajes").innerHTML = mensaje;
    indicador = indicador + 1;
    if (indicador == 6) {
        indicador = 0;
        mensaje = "";
    }
}

// Called when the connection is made
function onConnect() {
    console.log("conectado al broker...");
    client.subscribe("publish/data");
}

// Connect the client, providing an onConnect callback
client.connect({
    onSuccess: onConnect,
   // userName: "useriot",
   // password: "12345678"
      mqttVersion: 3
});


function prenderLed() {
    console.log("Envio >> PRENDER");
    enviarMensaje("1", "state/led");
}

function apagarLed() {
    console.log("Envio >> APAGAR");
    enviarMensaje("0", "state/led");
}

function reconfigurar() {

    var msj = document.getElementById("tiempo").value;
    console.log("Envio >> RECONFIGURAR : " + msj);
    enviarMensaje(msj, "config/publish_time");
}

function enviarMensaje(mensaje, topico) {
    // Publish a Message
    var message = new Paho.MQTT.Message(mensaje);
    message.destinationName = topico;
    message.qos = 0;
    client.send(message);
}