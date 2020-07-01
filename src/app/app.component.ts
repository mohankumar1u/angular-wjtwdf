import {Component, OnInit} from '@angular/core';
import {Paho} from 'ng2-mqtt/mqttws31';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  windSpeed: Number;
  windDirection: Number;
  private client;

  mqttbroker = 'localhost';

    ngOnInit() {
      this.client = new Paho.MQTT.Client(this.mqttbroker, Number(9001), 'wxview');
      this.client.onMessageArrived = this.onMessageArrived.bind(this);
      this.client.onConnectionLost = this.onConnectionLost.bind(this);
      this.client.connect({onSuccess: this.onConnect.bind(this)});
    }

  onConnect() {
    console.log('onConnect');
    this.client.subscribe('wxstation/wind_speed');
    this.client.subscribe('wxstation/wind_direction');
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  onMessageArrived(message) {
    console.log('onMessageArrived: ' + message.destinationName + ': ' + message.payloadString);

    if (message.destinationName.indexOf('wind_speed') !== -1) {
      this.windSpeed = Number(message.payloadString);
    }

    if (message.destinationName.indexOf('wind_direction') !== -1) {
      this.windDirection = Number(message.payloadString);
    }

  }
}
