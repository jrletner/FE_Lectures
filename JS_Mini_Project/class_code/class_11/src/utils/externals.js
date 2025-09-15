// src/utils/externals.js
import dayjsLib from "https://esm.sh/dayjs@1.11.11";
import relativeTime from "https://esm.sh/dayjs@1.11.11/plugin/relativeTime";
dayjsLib.extend(relativeTime);
export const dayjs = dayjsLib;
export { nanoid } from "https://esm.sh/nanoid@5.0.7";
