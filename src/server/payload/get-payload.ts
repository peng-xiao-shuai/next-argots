import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { BasePayload } from 'payload';

class Singleton {
  private static _instance: Singleton;
  private payloadClient: Promise<BasePayload>;
  constructor() {
    this.payloadClient = getPayload({
      config: configPromise,
    });
  }

  static get getInstance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }

    return this._instance.payloadClient;
  }
}

const payloadPromise = Singleton.getInstance;

export default payloadPromise;
