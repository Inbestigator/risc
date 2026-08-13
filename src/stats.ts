import type Simulator from "./index.ts";

export function displayStats({ memory, X }: Simulator, memStart = 0xa00000) {
  let maxRegValueWidth = 5;

  const termWidth = process.stdout.columns || 80;
  const termHeight = process.stdout.rows || 24;
  const regNames = Object.keys(X) as `${keyof typeof X}`[];

  maxRegValueWidth = Math.max(maxRegValueWidth, ...regNames.map((r) => X[r]?.toString(16).length ?? 0));
  const regWidth = 4 + 1 + maxRegValueWidth;

  const brailleWidth = termWidth - regWidth - 2;
  const memoryBytesPerRow = brailleWidth * 8;
  const totalRows = termHeight - 1;

  const brailleRows = Math.floor(termHeight / 2);

  const lines: string[] = [];

  lines.push(`\x1b[4mReg |${" Val ".padStart(maxRegValueWidth)}│${" Memory".padEnd(brailleWidth + 1)}\x1b[0m`);

  for (let row = 0; row < totalRows; ++row) {
    const regName = regNames[row];
    const regText = regName
      ? regName.padStart(2).padEnd(4) + X[regName]?.toString(16).padStart(maxRegValueWidth).toUpperCase()
      : " ".repeat(regWidth - 1);

    const memOffset = row * memoryBytesPerRow + memStart;

    let memoryColumn = "";

    if (row < brailleRows) {
      const braille = [];
      for (let i = 0; i < brailleWidth; ++i) {
        let byte = 0;
        for (let b = 0; b < 8; ++b) {
          const addr = memOffset + i * 8 + b;
          if (addr < memory.length && memory[addr]) {
            byte |= 1 << b;
          }
        }
        braille.push(String.fromCodePoint(0x2800 + byte));
      }
      memoryColumn = braille.join("");
    } else {
      const bytesPerHexRow = Math.floor(Math.floor(brailleWidth / 3) / 4) * 4;
      const memAddr = memStart + (row - brailleRows) * bytesPerHexRow;
      const bytes = memory.slice(memAddr, memAddr + bytesPerHexRow);
      memoryColumn = Array.from(bytes)
        .map((b) => (b === 0 ? `\x1b[2m00\x1b[0m` : b.toString(16).padStart(2, "0").toUpperCase()))
        .join(" ");
    }

    lines.push(`${regText} │ ${memoryColumn}`);
  }

  process.stdout.write(`\x1b[H${lines.join("\n")}`);
}
