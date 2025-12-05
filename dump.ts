import { memory as defaultMem, memView as defaultView } from "./data";

export function dumpRanges(memory = defaultMem, view = defaultView) {
  const ranges: string[] = [];
  let start: number | null = null;
  let lastEnd = 0;

  for (let i = 0; i < memory.length - 4; i += 4) {
    const word = view.getUint32(i, true);
    if (word !== 0) {
      if (start === null) start = i;
    } else {
      if (start !== null) {
        ranges.push(`\x1b[2m[${start - lastEnd}]\x1b[0m`);
        lastEnd = i - 1;
        ranges.push(`[${start}:${i - 1}]`);
        start = null;
      }
    }
  }

  if (start !== null) {
    ranges.push(`[${start}-${memory.length - 1}]`);
  }

  return ranges.join("");
}
