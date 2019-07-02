import {Component} from '@angular/core';
import {CryptographyService} from './cryptography/cryptography.service';
import * as uuid from 'uuid/v4';
import {log} from 'util';
import {timestamp} from 'rxjs/operators';


const RSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
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
SlawcHfEjxa+4Twfg10eHpXUL9iR
-----END PRIVATE KEY-----`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  userId = '84b33655-b336-4fcd-b76d-d0a898196776';
  keyId = '98c27855-f44f-4a45-9944-e375de3941a6';
  privateKey = null;

  constructor(private cryptoService: CryptographyService) {
    this.privateKey = this.cryptoService.pemToPrivateKey((RSA_PRIVATE_KEY));
  }


  private _message = 'write something';
  qrString = 'lol';

  generateKey(){
    let keyPair = this.cryptoService.generateKeyPair();
    let publicPem = this.cryptoService.publicKeyToPem(keyPair.publicKey);
    let privatePem = this.cryptoService.privateKeytoPem(keyPair.privateKey);
    console.log(publicPem);
    console.log(privatePem);
  }

  generateQr() {
    let nonce = uuid();

    let timestamp = new Date(Date.now() + 10000000);

    let payload = {
      nonce: nonce,
      sub: this.userId,
      keyId: this.keyId,
      exp: timestamp.toISOString(),
    };

    let signedToken = this.cryptoService.sign(payload, this.privateKey);
    this.qrString = signedToken;
    console.log(signedToken);
  }

  set message(newValue) {
    this._message = newValue;
    this.qrString = JSON.stringify({message: this._message});
  }

  get message() {
    return this._message;
  }
}
