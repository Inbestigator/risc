import { stdout } from "bun";
import { memory as defaultMem, X as defaultRegs } from "./data";

let maxRegValueWidth = 5;

export function displayStats(memory = defaultMem, registers: Record<string, number> = defaultRegs) {
  const termWidth = process.stdout.columns || 80;
  const termHeight = process.stdout.rows || 24;

  const regNames = Object.keys(registers) as (keyof typeof registers)[];

  maxRegValueWidth = Math.max(
    maxRegValueWidth,
    ...regNames.map((r) => registers[r]!.toString(16).length)
  );
  const regWidth = 4 + 1 + maxRegValueWidth;

  const brailleWidth = termWidth - regWidth - 2;
  const memoryBytesPerRow = brailleWidth * 8;
  const totalRows = termHeight - 1;

  const brailleRows = Math.floor(termHeight / 2);

  const lines: string[] = [];

  lines.push(
    `\x1b[4mReg |${" Val ".padStart(maxRegValueWidth)}│${" Memory".padEnd(brailleWidth + 1)}\x1b[0m`
  );

  for (let row = 0; row < totalRows; ++row) {
    const regName = regNames[row];
    const regText = regName
      ? regName.padEnd(4) +
        registers[regName]!.toString(16).padStart(maxRegValueWidth).toUpperCase()
      : " ".repeat(regWidth);

    const memOffset = row * memoryBytesPerRow;

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
        braille.push(String.fromCharCode(0x2800 + byte));
      }
      memoryColumn = braille.join("");
    } else {
      const bytesPerHexRow = Math.floor(Math.floor(brailleWidth / 3) / 4) * 4;
      const memAddr = 0xa00 + (row - brailleRows) * bytesPerHexRow;
      const bytes = memory.slice(memAddr, memAddr + bytesPerHexRow);
      memoryColumn = Array.from(bytes)
        .map((b) => (b === 0 ? `\x1b[2m00\x1b[0m` : b.toString(16).padStart(2, "0").toUpperCase()))
        .join(" ");
    }

    lines.push(`${regText} │ ${memoryColumn}`);
  }

  stdout.write("\x1b[H" + lines.join("\n"));
}
