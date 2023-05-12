export type JobInput = {
  jobUrl: string;
  selector: string;
};

export async function getJobInput(business: string): Promise<JobInput> {
  const input = await import(`${__dirname}/${business}.ts`);
  return input.default;
}

export * from "./bitonic";
