"use server";

// @ts-ignore
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "@/nillionOrgConfig.js";
import schema from "@/schema.json" with { type: "json" };
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { Message } from "ai";

type Result<R> = Promise<
  { ok: true; value: R } | { ok: false; message: string }
>;

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

export async function newChat() {
  redirect(`/chat/${randomUUID()}/${randomUUID()}`);
}

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

// reconstruct original object
function assembleChunks(chunks: Chunk[]) {
  const total = chunks.reduce((acc, v) => acc + v.sz, 0);
  const buf = Buffer.alloc(chunks.reduce((acc, v) => acc + v.sz, 0));

  chunks
    .sort((a, b) => a.idx - b.idx)
    .reduce((acc, v) => {
      buf.fill(v.data, acc, acc + v.sz, "base64url");
      console.log(
        "unpacking",
        new TextDecoder().decode(Buffer.from(v.data, "base64url")),
        v.data,
        "from",
        acc,
        "to",
        acc + v.sz,
        "out of",
        total,
      );
      return acc + v.sz;
    }, 0);

  console.log(new TextDecoder().decode(buf));

  return buf;
}

export async function appendObject(
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
