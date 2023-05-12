import { JobChecker } from "./modules/browser";
import { Nostr } from "./modules/nostr";
import dotenv from "dotenv";
import { getJobInput } from "./modules/websites";

dotenv.config();

const nostrKey = process.env.NOSTR_PRIV_KEY;
const nostrRecipient = process.env.NOSTR_RECIPIENT;
const nostrRelay = process.env.NOSTR_RELAY;

if (!nostrKey || !nostrRecipient || !nostrRelay) {
  throw new Error(`Not all environment variables are defined`);
}

const nostr = new Nostr(nostrKey, nostrRelay);

export async function request(
  business: string,
  keyword: string
): Promise<void> {
  if (!nostrRecipient) {
    throw new Error(`No nostr recipient enabled`);
  }
  const jobInputData = await getJobInput(business);
  const jobChecker = new JobChecker(jobInputData.jobUrl, jobInputData.selector);
  const jobs = await jobChecker.getVacancies();
  const filteredJobs = jobs.filter((job) => job.includes(keyword));
  await nostr.sendMessage(
    nostrRecipient,
    `${business} is looking for: ${filteredJobs.join(", ")}`
  );
  return;
}
