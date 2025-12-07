import { argv, stdout } from "bun";
import { run } from "..";
import { compile } from "./compile";
import { displayStats } from "../stats";
import { memView } from "../data";

const compiled = await compile(`${argv[3]}.cpp`);

globalThis.ecall = { 1000() {} };

switch (argv[2]) {
  case "stats":
    console.clear();
    run(compiled, displayStats);
    break;
  case "screen":
    globalThis.ecall[1000] = () => {
      stdout.write("\x1b[H");
      for (let i = 0; i < 432; ++i) {
        stdout.write(
          `\x1b[48;5;${memView.getUint8(0xa00000 + i)}m ${(i + 1) % 36 === 0 ? "\n" : ""}`
        );
      }
      stdout.write("\x1b[0m");
    };
    console.clear();
    run(compiled);
    break;
  case "hl":
    run(compiled);
}
