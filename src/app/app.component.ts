import {Component} from '@angular/core';
import {CryptographyService} from './cryptography/cryptography.service';
import * as uuid from 'uuid/v4';
import {HttpClient} from '@angular/common/http';
import {post} from 'selenium-webdriver/http';


const RSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCu7BsmNJOFa3f7
4vv9DTw/W7XgC7cE2SPEmtNx3laTU1MrB+6y3kJmPH4WnmETRQ892qIQA7THA2t+
G9ag31Mh5B8FhPHsnF5TndVyCjCFxCCGbCMVu1eLTWjpYKGYFp7rSWkibIqYyATb
DJOGSJt+azr5UbBf0a82XmA9Kx6GC+etv4+TCbfyOEDtfs27qH7C6eCpdlsFCZ/v
Xe97kZNzqdREX/jnhIZknM0GJlUUFze7+axvqpidxZH29FS1qN1G6sj7LKDp0LMj
tnckwxl1J2u8aXxSbebkv+8zF5uj5N6jNxFkSZFRneXOSnDvcjIEhuecAuQc8ffV
RfHngAwpAgMBAAECggEASKpKqPdkZSN854Wmuru50HQvvNABCqGNq0nKFt6PRopx
3UlhTqroGIJ+urS2jQO+Tiq58j8n5Ri1meDEq3W6mjSi8m8E9Q8MXF4P4lz7RUZx
YIYhmRCHUJYqw/BhkMWs5P9NDoDanpdQ9RJnYnxdJAo1qIbX5yY7TDGudxqnhnVR
SVVxOHa4z1aWmBs4ZfdLuuZLR7VKlrxJczk90U+gUHwwRxzG9QzuwnsMeBRcd7FL
cQwDknYuxjEHcr040/HZaxqp7AsTzgrQtvlXuuJJWptICguvCpoOJ0/rcv7pxnIK
Q6dbh7b+cd7r4wJWKos97IXOz31Awekw39YbN08VNQKBgQDkTPsyNRrTWZXZtAMN
mm/qHwMst7RwifqI3JyOi6rz+MKpYBwbz+sMXOYy7bq4koTp2/LFetW6puYvCXt3
x2OELe5IVpTwLfIVrtrA92o4lEaFJE+X2D1C+dHWuS+4OsuNhMOGaUo3Q4PIACB4
FyHhxC8zaO8jrT47zMd+iZrE1wKBgQDEJTEA0BjWdA/Yx46SIMD0+5gvZd8LROXr
6HtabMn5pUTL8gyverDOv5VwBk1Y0mv5ztfaP494RByYQUHNaf2lVENJ+ddcPuVx
qwnbBDVXf/ReWWdaxnoD4evSgiO4+IuWGmbzTEq8L/WPMr8+theIdL1DjoWcnkkf
uY4PMQCW/wKBgQDP34xFrfbsBEEehfrVsw499dj1KZwBcJEPdxiR7nhNRu8wO9O8
OzgA/MGaE74Ve0vMiDnoOC1Nk9Q5df/XE1T4sL2rXjKk8qDfv2Ntmpo8RD5l0qcq
UnmNd1zqj5n0vIxFImLKCyrJYQ8n1324+w8du31i6SP9ryvgVVg8Tlz+5wKBgHFw
jRHKSMMm5s9aQsOSu+Yz6IVpJoFu/IbesxDOIFYI1mwZdmq6y60XModSrcM0F4yn
q0EnR4On6N3JyBPUPAU1YaFUJNDN84c1A4MuwOb1MtCqZlMivQinzeq2p5Bf9uL+
LBKESijil+OU1vSe/adG1PtQX0gAZ4w4lceFcLDjAoGBAJxYzSc9xJuZW6dEh5xy
hhM0or+SPv8lx8hNq1UslUToDd4XE3AHVXbQ5D6X+gned/AWz+BY/TkCuEH8XImN
JWgOD/4sT1gcWz3VBRvF7Q4DlBNK2BpQovCo0FRI3ho341fBME0Bmt9jZf1CWfwX
IDCeKnigqO9zDH2cn5rmaVxh
-----END PRIVATE KEY-----`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  userId = '84b33655-b336-4fcd-b76d-d0a898196776';
  keyId = '2c18cf6a-edaa-4d32-963a-1fab8fc8c465';
  privateKey = null;

  constructor(private http: HttpClient, private cryptoService: CryptographyService) {
    this.privateKey = this.cryptoService.pemToPrivateKey((RSA_PRIVATE_KEY));
  }


  private _message = 'write something';
  qrString = 'lol';
  publicPem;
  privatePem;

  generateKey(){
    let keyPair = this.cryptoService.generateKeyPair();
    this.publicPem = this.cryptoService.publicKeyToPem(keyPair.publicKey);
    this.privatePem = this.cryptoService.privateKeytoPem(keyPair.privateKey);
    console.log(this.publicPem);
    console.log(this.privatePem);
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

  async sendKey(){
    let stuff =  await this.http.post<any>('https://services.idx.pensare.mx/api/verify', {signedToken: this.qrString, idKey: this.keyId}).toPromise();
    console.log(stuff);
  }
}
