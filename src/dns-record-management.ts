import * as fs from "fs";
import { parse as parseYaml } from "yaml";

import Route53, {
  Change,
  Changes,
  ChangeInfo,
  ChangeBatch,
  ResourceRecordSets,
  ChangeResourceRecordSetsRequest,
} from "aws-sdk/clients/route53";

export interface DeleteDnsRecordsInput {
  hostedZoneId: string;
  records: string;
  comment?: string;
}

function getClient(): Route53 {
  return new Route53({
    customUserAgent: "icalia-actions/aws-action",
    region: process.env.AWS_DEFAULT_REGION,
  });
}

function parseData(data: string): any {
  // parseYaml takes care of both YAML and JSON strings
  return parseYaml(data || "null");
}

function readData(filePath: string): any {
  const contents = fs.readFileSync(filePath, "utf8");
  return parseData(contents);
}

function processData(data: string): any {
  if (!data) return;
  if (fs.existsSync(data)) return readData(data);
  return parseData(data);
}

function generateDeletions(recordInput: string): Changes {
  const records = processData(recordInput) as ResourceRecordSets;

  return records.map((record) => {
    return { Action: "DELETE", ResourceRecordSet: record } as Change;
  }) as Changes;
}

export async function deleteDnsRecords(
  inputs: DeleteDnsRecordsInput
): Promise<ChangeInfo | undefined> {
  const { hostedZoneId, records, comment } = inputs;
  const changes = generateDeletions(records);

  const { ChangeInfo } = await getClient()
    .changeResourceRecordSets({
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Comment: comment,
        Changes: changes,
      } as ChangeBatch,
    } as ChangeResourceRecordSetsRequest)
    .promise();

  return ChangeInfo;
}
