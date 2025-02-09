"use server";

// @ts-ignore
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "@/nillionOrgConfig.js";
import schema from "@/schema.json" with { type: "json" };
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { Message } from "ai";

type Chunk = {
  _id: string;
  object: string;
  ts: number;
  sz: number;
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

// approximate so it doesn't go over 4K after b64 encoding
const MAX_CHUNK_SIZE = 3064;

// just generates new session and party key
export async function newChat() {
  redirect(`/chat/${randomUUID()}/${randomUUID()}`);
}

// obtain entire history for session/schema ID
export async function getHistory(schemaId: string): Promise<Message[]> {
  try {
    ORG.setSchemaId(schemaId);
    let readChunks: Chunk[];

    try {
      readChunks = await ORG.readFromNodes();
    } catch (e) {
      await ORG.createSchema(schema, schemaId, schemaId);
      readChunks = await ORG.readFromNodes();
    }

    // chronosort in place
    // same object chunks will always have same ts (see `toVault`)
    readChunks.sort((c1, c2) => c1.ts - c2.ts);
    // group by object id
    let chunkChunks: { id: string; chunks: Chunk[] }[] = [];

    for (const chunk of readChunks) {
      const last = chunkChunks.at(-1);

      if (last && last.id === chunk.object) {
        last.chunks.push(chunk);
      } else {
        chunkChunks.push({ id: chunk.object, chunks: [chunk] });
      }
    }

    // join chunks into obj bytes and parse into messages
    return chunkChunks.map(({ chunks }) =>
      JSON.parse(
        new TextDecoder("utf-8").decode(
          new Uint8Array(
            assembleChunks(chunks.sort((c1, c2) => c1.idx - c2.idx)),
          ),
        ),
      ),
    );
  } catch (e) {
    console.log(e);
    return [];
  }
}

// export const getObject: (
//   schemaId: string,
//   objectId: string,
// ) => Result<Uint8Array> = async (schemaId, objectId) => {
//   try {
//     ORG.setSchemaId(schemaId);
//     return {
//       ok: true,
//       value: new Uint8Array(
//         assembleChunks(await ORG.readFromNodes({ object: objectId })),
//       ),
//     };
//   } catch (error) {
//     return { ok: false, message: `Server error: failed to read: ${error}` };
//   }
// };

// reconstruct original object from chunks
function assembleChunks(chunks: Chunk[]) {
  const buf = Buffer.alloc(chunks.reduce((acc, v) => acc + v.sz, 0));

  chunks
    .sort((a, b) => a.idx - b.idx)
    .reduce((acc, v) => {
      buf.fill(v.data, acc, acc + v.sz, "base64url");
      return acc + v.sz;
    }, 0);

  return buf;
}

// the 4K limit currently gets in the way of preserving big JSON directly
// b64 binary wastes a bit of space but is more reliable/universal
export async function appendObjectJSON(
  schemaId: string,
  objectId: string,
  data: any,
) {
  await appendObjectBinary(
    schemaId,
    objectId,
    new TextEncoder().encode(JSON.stringify(data)),
  );
}

export async function appendObjectBinary(
  schemaId: string,
  objectId: string,
  data: Uint8Array,
) {
  // Unix epoch timestamp
  const ts = Math.floor(Date.now() / 1000);

  // max string size seems to be 4096 on their side for now
  ORG.setSchemaId(schemaId);
  await ORG.writeToNodes([
    ...chunks(data, MAX_CHUNK_SIZE).map((chunk, i) => ({
      object: { $allot: objectId },
      ts,
      sz: chunk.length,
      idx: i,
      data: { $allot: Buffer.from(chunk).toString("base64url") },
    })),
  ]);
}
