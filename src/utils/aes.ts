import CryptoJS from 'crypto-js';

export default class AES {
  private worker: Worker;
  private ivHexString: string;
  private passphrase: string;
  private salt: string;
  private key?: string;
  constructor(options: { passphrase: string; ivHexString: string }) {
    this.worker = new Worker(new URL('./aes-worker.ts', import.meta.url));
    this.ivHexString = options.ivHexString;
    this.passphrase = options.passphrase;
    this.salt = process.env.NEXT_PUBLIC_SALT!;
  }

  private deriveKey(): Promise<string> {
    return new Promise((resolve) => {
      this.worker.onmessage = (
        e: MessageEvent<{ type: string; key?: string }>
      ) => {
        if (e.data.type === 'derivedKey') {
          this.key = e.data.key!;
          resolve(this.key);
        }
      };

      this.worker.postMessage({
        type: 'deriveKey',
        passphrase: this.passphrase,
        ivHexString: this.ivHexString,
        salt: this.salt,
      });
    });
  }

  async encrypt(value: string): Promise<string> {
    if (!this.key) {
      await this.deriveKey();
    }

    return new Promise((resolve) => {
      this.worker.onmessage = (
        e: MessageEvent<{ type: string; encrypted?: string }>
      ) => {
        if (e.data.type === 'encrypted') {
          resolve(e.data.encrypted!);
        }
      };

      this.worker.postMessage({
        type: 'encrypt',
        key: this.key,
        ivHexString: this.ivHexString,
        value: value,
      });
    });
  }

  async decrypt(value: string): Promise<string> {
    if (!this.key) {
      await this.deriveKey();
    }

    return new Promise((resolve) => {
      this.worker.onmessage = (
        e: MessageEvent<{ type: string; decrypted?: string }>
      ) => {
        if (e.data.type === 'decrypted') {
          resolve(e.data.decrypted!);
        }
      };

      this.worker.postMessage({
        type: 'decrypt',
        key: this.key,
        ivHexString: this.ivHexString,
        value: value,
      });
    });
  }
}
