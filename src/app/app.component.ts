import {Component} from '@angular/core';
import {CryptographyService} from './cryptography/cryptography.service';
import * as uuid from 'uuid/v4';
import {log} from 'util';
import {timestamp} from 'rxjs/operators';


const RSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgjxsvFI0Xo0n5
8su6oai0ALNL7phLUbhpug8dHoZ3n8bRzdO0E3uOax/ckUY9U9Ueywyjg2US2627
UmnZJh+u+u4iiSqdzy+jdxUw4XxyVlmJaZ88F4/ztI+NNBmbdwlCGnhNEut+mKER
XOF/951HbP1Bkgp6MRXlY1IBN8nuUyX5VtE+NEwJOh0UDcWDZtDi1ix934/grOmB
BuNE3l9pVZYhl/sARnkX3KTTBnad2mZq2117YRh6aiiTNlIMFsLYSVTYCzGGJ9mr
O6CJZ69qop0uv1otEcI9E77dBmjXuW1uXk8C0ftmaVQr1XyvGLOgYC4ZyD5ZmBoQ
iEGtlkuzAgMBAAECggEANTY4dCoDeMoNQmFNU9Uv7DgvNAMnRg8XZzLav3PWbN7v
LalheFTcph6quJcNCFY4U7RHxAlP/igANAzkN6uC5KMVOSzsitCXoT1eMI0KiXpE
wl3XADtu4f39dXbG5ddVoirTo/eZRKOg/fgiZB7UaU+dv5V/E3AhKZz5GJ48tlch
AtIwksfE/fqHEUJ+vUpSBkRyaKdH8T9oJAQV4L53NC1W5TP7c7mhF+gbFzvO52Np
eC0uX++RyWSnyDDe/ueu1eXBboTKz8TOcwFcVrBInQGlUVD0+Sz2eJc3iL97nx3+
raMqiq7+0dI9fUew4RV4aAMvvGqmqC+z3MwksBqGwQKBgQDjU4/KDztn9TFTR1Hp
4fnJGHG4qv9Fb2v7xnHQWxb4PkCcB3D5r/AZKQxZpP+dVNpRazBblNAeHMDy34UG
5gYUbaweDHtxk7ZiDMQFvp5Im8g38fl2AF1ylGniBuTq5+45Y654Y8fuETF2E/0K
tbpDM3qFa9lUZJJA22KbIFBNTwKBgQC0z5rcINMVOvtvDBQ1ZepyDLJsUIvMjsY9
XUdbFUpHjLa+evSNPr1In/jl0ySqqvD8QI5cK8zVHA2Fgl7kkBBUrhKFGb/qs44/
PDffJwsJTaXZFgotmidBi0WhPrYLAzLa5Nq9F/8Yu4LuaUB4SE9VxUy4ztALZaAn
su5g6kDqXQKBgECCqB1pMSyRMkw1wxMiI6Zjn3IOZJ6pvfUXHZlJID2WPPOKUQ8q
VHJvaafO4RMez02no3N5yY2iD0ddEv0gLb2CWgO0+xsCFhHBGaefrn9gZfMqYeaQ
t/QaFeoklrXq13nFxe84MbZnfqfJiFePtqn3Y9+U+XmviKmLGHJ5OxCVAoGAROMn
5CBZa6hKLVfTxzhqJ0OxItVZPflTjAOi8Q/eef4hjdb4n2u84BOa160nNiLkp6bM
1k8Vvkfu2uP91WUR48FiavWRihEY6/y8aLfOW6AKxPfBrvghZrZyM+nZn757PKye
rhabaUffrYfKOUmLeGkwPuUEnKL+bsGcUq5NRz0CgYBwTJXCL2XoGDQnbfU+umd+
TuZ/ivFErmeIuUlYwJ0rjgEVS2y7FLdsM1tFNucIg3AwjCVipbsAHdAYAqRNkKp+
WXsv/VNuvoBwQ9ZpAkZ3+SRaMziiwxXZ4MCw5MgTzWnBG28L4d1Ma5a14+IpBM4U
2t7zQtojTgFT6ff/Ndm2Zg==
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
