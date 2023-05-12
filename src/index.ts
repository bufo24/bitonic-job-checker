import { BitonicJobChecker } from "./browser/bitonic";
import dotenv from "dotenv";
import { Nostr } from "./nostr/nostr";

dotenv.config();

const nostrKey = process.env.NOSTR_PRIV_KEY;

if (!nostrKey) {
  throw new Error(`No nostr key found`);
}

const nostr = new Nostr(nostrKey, "wss://relay.nostr.vet");

const bitonicJobChecker = new BitonicJobChecker(
  "https://bitonic.nl/jobs",
  ".jobs__list.article-list > article > a > h3.article-list__article-title"
);

(async () => {
  const jobs = await bitonicJobChecker.getVacancies();
  jobs.forEach(async (job) => {
    if (job.includes("engineer")) {
      await nostr.sendMessage(
        "6754f561a7165c4e2e109b49867d88bd5695e90dbb67a95cb4132e3a0f16f679",
        `Bitonic is looking for: ${job}`
      );
    }
  });
  return;
})();
