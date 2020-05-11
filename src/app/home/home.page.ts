import { Component } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  connectSubscription: any;
  disconnectSubscription: any;

  constructor(
    private network: Network,
    private toastController: ToastController
  ) { }

  ionViewWillEnter() {
    if (this.network.type === 'none') {
      this.presentToast('You Are Not Connected To Network');
    } else if (this.network.type === 'wifi') {
      this.presentToast('You Are Using Wi-fi Network');
    } else if (this.network.type === '4g' || this.network.type === '3g' || this.network.type === '2g') {
      this.presentToast('You Are Using Mobile Data');
    }
    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.presentToast('Network Connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          this.presentToast('You Are Using Wi-fi Network');
        } else if (this.network.type === '4g' || this.network.type === '3g' || this.network.type === '2g') {
          this.presentToast('You Are Using Mobile Data');
        }
      }, 3000);
    });

    // watch network for a disconnection
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.presentToast('Network Disconnected');
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }

  ionViewWillLeave() {
    // stop connect watch
    this.connectSubscription.unsubscribe();
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
  }
}
