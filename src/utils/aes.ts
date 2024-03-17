import CryptoJS from 'crypto-js';

export default class AES {
  private key: string | CryptoJS.lib.WordArray;
  private iv: CryptoJS.lib.WordArray;
  constructor(options: { passphrase: string; ivHexString: string }) {
    this.iv = CryptoJS.enc.Hex.parse(options.ivHexString);

    // 使用 PBKDF2 派生一个密钥
    this.key = CryptoJS.PBKDF2(
      options.passphrase,
      process.env.NEXT_PUBLIC_SALT!
    );
  }

  encrypted(value: string) {
    return CryptoJS.AES.encrypt(value, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  decrypted(value: string) {
    return CryptoJS.AES.decrypt(value, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  }
}
