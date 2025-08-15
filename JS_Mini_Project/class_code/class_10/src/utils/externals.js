// src/utils/externals.js
// Centralized ESM CDN imports so it's easy to swap providers if needed.
// Requires an internet connection when running via local server.

// dayjs + relativeTime plugin
import dayjsLib from "https://esm.sh/dayjs@1.11.11";
import relativeTime from "https://esm.sh/dayjs@1.11.11/plugin/relativeTime";
dayjsLib.extend(relativeTime);
export const dayjs = dayjsLib;

// nanoid for unique IDs
export { nanoid } from "https://esm.sh/nanoid@5.0.7";
