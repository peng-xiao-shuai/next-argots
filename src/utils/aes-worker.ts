import CryptoJS from 'crypto-js';

type WorkerMessageData = DeriveKey | Encrypt | Decrypt;
interface MessageData {
  /**
   * 派生 key 值
   */
  type: 'deriveKey' | 'encrypt' | 'decrypt';
  /**
   * 密码hash
   */
  passphrase: string;
  /**
   * 盐值
   */
  salt: string;
  /**
   * iv
   */
  ivHexString: string;
  /**
   * 要加密的值
   */
  value: string;
  /**
   * PBKDF2 派生的密钥
   */
  key: string;
}
interface DeriveKey extends MessageData {
  /**
   * 派生 key 值
   */
  type: 'deriveKey';
  /**
   * 密码hash
   */
  passphrase: string;
  /**
   * 盐值
   */
  salt: string;
}
interface Encrypt extends MessageData {
  /**
   * 加密
   */
  type: 'encrypt';
  /**
   * iv
   */
  ivHexString: string;
  /**
   * 要加密的值
   */
  value: string;
  /**
   * PBKDF2 派生的密钥
   */
  key: string;
}
interface Decrypt extends MessageData {
  /**
   * 解密
   */
  type: 'decrypt';
  /**
   * iv
   */
  ivHexString: string;
  /**
   * 要加密的值
   */
  value: string;
  /**
   * PBKDF2 派生的密钥
   */
  key: string;
}

self.onmessage = function ({ data }: { data: WorkerMessageData }) {
  const { type, passphrase, ivHexString, value, key, salt } = data;

  if (type === 'deriveKey' && passphrase && salt) {
    const derivedKey = CryptoJS.PBKDF2(
      passphrase,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: 256 / 32 }
    );
    self.postMessage({ type: 'derivedKey', key: derivedKey.toString() });
  } else if (type === 'encrypt' && value && key && ivHexString) {
    const iv = CryptoJS.enc.Hex.parse(ivHexString);
    const parsedKey = CryptoJS.enc.Hex.parse(key);
    const encrypted = CryptoJS.AES.encrypt(value, parsedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    self.postMessage({ type: 'encrypted', encrypted });
  } else if (type === 'decrypt' && value && key && ivHexString) {
    const iv = CryptoJS.enc.Hex.parse(ivHexString);
    const parsedKey = CryptoJS.enc.Hex.parse(key);
    const decrypted = CryptoJS.AES.decrypt(value, parsedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    self.postMessage({ type: 'decrypted', decrypted });
  }
};
