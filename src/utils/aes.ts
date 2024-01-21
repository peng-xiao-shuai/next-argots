import CryptoJS from 'crypto-js'

export default class AES {
  private iv: CryptoJS.lib.WordArray
  private key: string | CryptoJS.lib.WordArray
  constructor(options: { passphrase: string; salt: string }) {
    this.iv = CryptoJS.lib.WordArray.random(128 / 8)

    // 使用 PBKDF2 派生一个密钥
    this.key = CryptoJS.PBKDF2(options.passphrase, options.salt)
  }

  encrypted(value: string) {
    return CryptoJS.AES.encrypt(value, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()
  }

  decrypted(value: string) {
    return CryptoJS.AES.decrypt(value, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
  }
}
