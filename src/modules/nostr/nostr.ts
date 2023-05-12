import {
  relayInit,
  Relay,
  getPublicKey,
  signEvent,
  UnsignedEvent,
  Event,
  getEventHash,
  nip04,
} from "nostr-tools";
import "websocket-polyfill";

export class Nostr {
  private readonly privKey: string;
  private readonly relay: Relay;
  constructor(privKey: string, relayUrl: string) {
    this.privKey = privKey;
    this.relay = relayInit(relayUrl);
  }

  async sendMessage(recipient: string, message: string): Promise<void> {
    let ciphertext = await nip04.encrypt(this.privKey, recipient, message);
    await this.relay.connect();
    const event: UnsignedEvent = {
      kind: 4,
      pubkey: getPublicKey(this.privKey),
      tags: [["p", recipient]],
      content: ciphertext,
      created_at: Math.round(Date.now() / 1000),
    };
    const id = getEventHash(event);
    const sig = signEvent(event, this.privKey);
    const signedEvent: Event = {
      id,
      sig,
      ...event,
    };
    let pub = this.relay.publish(signedEvent);
    pub.on("failed", (reason: string) => {
      console.error(`failed to publish to ${this.relay.url}: ${reason}`);
    });
  }
}
