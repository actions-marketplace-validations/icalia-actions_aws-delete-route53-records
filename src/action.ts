import { info, getInput } from "@actions/core";

import {
  deleteDnsRecords,
  DeleteDnsRecordsInput,
} from "./dns-record-management";


export async function run() {
  const changeInfo = await deleteDnsRecords({
    hostedZoneId: getInput("hosted-zone-id"),
    records: getInput("records"),
    comment: getInput("comment"),
  } as DeleteDnsRecordsInput);

  if (!changeInfo) throw new Error("Failed to apply changes");

  info("Change Info:");
  info(`  Id: ${changeInfo.Id}`);
  info(`  Status: ${changeInfo.Status}`);
  info(`  Submitted At: ${changeInfo.SubmittedAt}`);
  info(`  Comment: ${changeInfo.Comment}`);

  return 0;
}
