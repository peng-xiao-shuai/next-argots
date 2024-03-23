import Pusher from 'pusher';

declare global {
  var _pusher: Pusher;
}

class Singleton {
  private static _instance: Singleton;
  private pusher: Pusher;
  private constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      secret: process.env.PUSHER_APP_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
      useTLS: true,
    });
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._pusher = this.pusher;
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }
    return this._instance.pusher;
  }
}
const pusher = Singleton.instance;

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default pusher;
