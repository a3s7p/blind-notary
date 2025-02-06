"use server";

import { fromBase64, toBase64 } from "@cosmjs/encoding";
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "@/nillionOrgConfig.js";
import schema from "@/schema.json" with { type: "json" };

type Result<R> = Promise<
  { ok: true; value: R } | { ok: false; message: string }
>;

const ORG: SecretVaultWrapper = await (async () => {
  const org = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials);
  await org.init();
  return org;
})();

function* chunks(arr: Uint8Array, n: number): Generator<Uint8Array, void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

export const toVault: (name: string, data: Uint8Array) => Result<void> = async (
  name,
  data,
) => {
  try {
    const newSchemaId = (await ORG.createSchema(schema, name))[0].result.data;
    console.log("New schema:", newSchemaId);
    ORG.setSchemaId(newSchemaId);

    const dataWritten = await ORG.writeToNodes([
      ...chunks(data, 3064)
        .map(toBase64)
        .map((chunk, i) => ({
          idx: i,
          data: { $allot: chunk },
        })),
    ]);

    console.log("Data written to nodes:", JSON.stringify(dataWritten, null, 2));
    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, message: `Server error: failed to upload: ${error}` };
  }
};

export const fromVault: (name: string) => Result<Uint8Array> = async (name) => {
  try {
    // TODO join from N parts on 16M size boundary
    const decryptedCollectionData = await ORG.readFromNodes({ name });
    console.log(`Records under ${name}:`);
    decryptedCollectionData.forEach((v: any) => console.log(v));
    return { ok: true, value: fromBase64(decryptedCollectionData[0]) };
  } catch (error) {
    return { ok: false, message: `Server error: failed to upload: ${error}` };
  }
};
