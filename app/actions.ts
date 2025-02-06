"use server";

import { fromBase64, toBase64 } from "@cosmjs/encoding";
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "./nillionOrgConfig";

type Result<R> = Promise<
  { ok: true; value: R } | { ok: false; message: string }
>;

const DOCS: SecretVaultWrapper = await (async () => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env["NOTARY_SECDOC_SCHEMA_ID"],
  );
  await collection.init();
  return collection;
})();

export const toVault: (name: string, data: Uint8Array) => Result<void> = async (
  name,
  data,
) => {
  try {
    // TODO split into N parts on 16M size boundary
    const dataWritten = await DOCS.writeToNodes([
      {
        name: { $allot: name },
        data: { $allot: toBase64(data) },
      },
    ]);

    console.log("Data written to nodes:", JSON.stringify(dataWritten, null, 2));

    const newIds = [
      ...new Set(
        dataWritten.map((item: any) => item.result.data.created).flat(),
      ),
    ];

    console.log("Uploaded record IDs:", newIds);
    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, message: `Server error: failed to upload: ${error}` };
  }
};

export const fromVault: (name: string) => Result<Uint8Array> = async (name) => {
  try {
    // TODO join from N parts on 16M size boundary
    const decryptedCollectionData = await DOCS.readFromNodes({ name });
    console.log(`Records under ${name}:`);
    decryptedCollectionData.forEach((v: any) => console.log(v));
    return { ok: true, value: fromBase64(decryptedCollectionData[0]) };
  } catch (error) {
    return { ok: false, message: `Server error: failed to upload: ${error}` };
  }
};
