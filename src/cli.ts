import { request } from ".";

const { Command } = require("commander");
const program = new Command();

program
  .name("job-checker")
  .description("CLI to check job vacancies")
  .version("0.0.1");

program
  .command("vacancies")
  .description("Get outstanding vacancies for a website")
  .argument("<business>", "business to check")
  .argument("<keyword>", "word to filter vacancies on")
  .action(async (business: string, keyword: string) => {
    return await request(business, keyword);
  });

program.parse();
