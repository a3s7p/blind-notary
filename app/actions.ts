"use server";

import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "@/nillionOrgConfig.js";
import schema from "@/schema.json" with { type: "json" };

type Result<R> = Promise<
  { ok: true; value: R } | { ok: false; message: string }
>;

type Chunk = {
  _id: string;
  idx: number;
  data: string;
};

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

const CHUNK_SIZE = 3064;

export const toVault: (name: string, data: Uint8Array) => Result<void> = async (
  name,
  data,
) => {
  try {
    const newSchemaId = (await ORG.createSchema(schema, name))[0].result.data;
    console.log("New schema:", newSchemaId);
    ORG.setSchemaId(newSchemaId);

    const dataWritten = await ORG.writeToNodes([
      ...chunks(data, CHUNK_SIZE).map((chunk, i) => ({
        idx: i,
        data: { $allot: Buffer.from(chunk).toString("base64url") },
      })),
    ]);

    console.log("Data written to nodes:", JSON.stringify(dataWritten, null, 2));
    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, message: `Server error: failed to write: ${error}` };
  }
};

export const fromVault: (id: string) => Result<Uint8Array> = async (id) => {
  try {
    ORG.setSchemaId(id);

    const readChunks: Chunk[] = await ORG.readFromNodes({});
    const buf = Buffer.alloc(readChunks.length * CHUNK_SIZE);

    // readChunks.sort((c1, c2) => c1.idx - c2.idx);
    readChunks.forEach((v) =>
      buf.fill(v.data, v.idx * 3064, (v.idx + 1) * 3064, "base64url"),
    );

    return { ok: true, value: new Uint8Array(buf) };
  } catch (error) {
    return { ok: false, message: `Server error: failed to read: ${error}` };
  }
};
