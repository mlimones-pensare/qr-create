import {Component} from '@angular/core';
import {CryptographyService} from './cryptography/cryptography.service';
import * as uuid from 'uuid/v4';
import {HttpClient} from '@angular/common/http';
import {post} from 'selenium-webdriver/http';


const RSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAGyb4elHX6ExoeCR
3J0xi29JBt92/3SUElaLS18vEAUeVppmFhctl9yL7+fIBkeS0vdHAw6LCKe7uZPG
SMt36NmiPi5DVFZ7iYSTUy4XyFXPQMYHIQKpD2QyA0R3ilqnkES8AW3k4R0MJ1el
62AceP+5xrGNyB87pe3HS9BvXFbnjSTAJQZiqB8HJM3+gEJ5zeI2tXJz3pfFrp3z
s2PVmpVs1Kfw48slvhSyG4+VhgXqx/VDVJjf7sc5L6WCkeS/Bcds4uH1K1O4zoQR
SUA9IVVwI4YGbAksLEYu7KNObKCGR7s6S0v85O++MKEh0vnZ6+hqIVBi4byzVUb3
0WfvjxcCAwEAAQKCAQAZlmAS5Y3SHC9XCQZAwntnLH1CCHcGsBvh589KDXxouE0O
8x4hN8yfWRicMrPICP9K4qAFvRu86K0/82cTCJ0DKQYdQB+OgGxVn5/pLBE2pi1M
ekF8rvfBU0cRylf+I5wJlYGAsnuWrFZYf+6EJjEbjlkRW6XaNeNRsbJa2OGYV4ZW
co/6LdiFbbHDUO+6HIjwmiXR+Q3vLpGBdKZZSNnwqYnQWFMAg4apFO9ZFywq7uw0
GUTJdodyIgmboI9ok/PegC1xyWV7cVxGtbgDYGZ4ywPiB1OKBe8HYW8qVoPuNqgg
3LGeG7kuzVkEYPJ30zBGsNZxRu/3Sf0qCWKSnvsBAoGBALLQnBb3nF9VRiXSTiQ5
vnpNFXUNk7+ecP33prk4sTrBp7kezi/NdVPbkow5shctgBoM9ALa8ph+s7ppSm8g
y5e9ZWkH+nw53wxigi+QKi+emRfBs6Ytjs8h8fTlDGHwgJCVFAxg+cTpYHR3OvP5
07DHRM3GR+mgJNhfvtH54fyJAoGBAJt9YLLajKw3NqnPV3BHIryuz7Pbefzhg15p
Lt7g4CSCzOR1NCgKDJ16uME955ciP1HNsMv+NCcvKXmEvSA58m13ykMrktZIbWTh
24YJ3blSRbmT2wl7sJRdiDM8tGiFIsqnyzY/8o55ZDzMWze5oUnSVnOamLGTPTyj
M3umRIafAoGBAK+mXf3to2y+Plb+vAW3t1U6DT7bZGxRflrrf5noh6fY/SHKke3B
HGSQhuc58af06SYt3TBE1RNZOsF9lkGNbJCU2l4PGU4YJvNqfMmuCtKWL3p3qzos
/GCZzqyqprw6XIAqAPSb+h4kxbwCNyXcHcdEJ2EfShrDVg46Fx76ILRJAoGAEB3h
zQgcNqmOb/F+5bNp5VbVTpY8Qbr6S+npIs76TK6GIFQJsPDBt/0Fc3pALAkvuQHy
BmL18u3Phbn9hH6dIz2caHP2x2FAfYlvoKgbJF9jvMWXmZcJiYdcW7s6E+9g2NKl
nJzqPlxUyHyCI/eIwUcdEOSAWT+ixEtCRdnJFo8CgYA1PRUe+Y7YvSRC1Zk4xy8/
THFOE1cEb5uMp2eMJ11GSKJrlfWjdXT31mrjAuvt6/h85vW1GX9bpEJ9704LNp0q
B1Wq5oqwZOa5UZoQROW79V1C7YsBfFYuKt1ZCzERahK1et0Tqj3AOD2HJGZ5TulM
qlkrv/uoZx+YjWpX9koYEQ==
-----END PRIVATE KEY-----`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  userId = '84b33655-b336-4fcd-b76d-d0a898196776';
  keyId = '7298b913-8787-4f77-bd5d-2cef159d7992';
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
