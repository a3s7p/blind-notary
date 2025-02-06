"use server";

import { fromBase64, toBase64 } from "@cosmjs/encoding";

type Result<R> = Promise<
  { ok: true; value: R } | { ok: false; message: string }
>;

export const toVault: (
  name: string,
  data: string | Uint8Array,
) => Result<void> = async (name, data) => {
  try {
    const _name = name;
    const _encoded = toBase64(new Uint8Array(Buffer.from(data)));

    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, message: `Server error: failed to upload: ${error}` };
  }
};

export const fromVault: (name: string) => Result<void> = async (name) => {
  try {
    const _name = name;
    const _decoded = fromBase64("");

    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, message: `Server error: failed to upload: ${error}` };
  }
};
