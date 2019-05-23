import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private _message = 'write something';
  qrString = '{}';

  set message(newValue){
    this._message = newValue;
    this.qrString = JSON.stringify({message: this._message});
  }

  get message(newValue){
    return this._message;
  }
}
