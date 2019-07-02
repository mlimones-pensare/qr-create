import { Injectable } from '@angular/core';
import * as r from 'jsrsasign';
import {KeyPair} from './KeyPair';

@Injectable({
  providedIn: 'root'
})
export class CryptographyService {

  constructor() { }

  generateKeyPair(): KeyPair {
    const keyPair = r.KEYUTIL.generateKeypair('RSA', 2048);
    const privateKey = keyPair.prvKeyObj;
    const publicKey = keyPair.pubKeyObj;
    return {
      publicKey,
      privateKey,
    };
  }

  publicKeyToPem(publicKey): string {
    return r.KEYUTIL.getPEM(publicKey);
  }

  privateKeytoPem(privateKey): string {
    return r.KEYUTIL.getPEM(privateKey, 'PKCS8PRV');
  }

  pemToPublicKey(pem: string) {
    return r.KEYUTIL.getKey(pem);
  }

  pemToPrivateKey(pem: string) {
    return r.KEYUTIL.getKey(pem, null);
  }


  sign(payload, privateKey) {
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    return r.jws.JWS.sign('RS256', header, payload, privateKey);
  }
}
