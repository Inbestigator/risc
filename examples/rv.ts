import { emitKeypressEvents } from "node:readline";
import { argv, stdout } from "bun";
import Simulator, { displayStats } from "../src";
import { compile } from "./compile";

const compiled = await compile(`${argv[3] ?? argv[2]}.cpp`);
const sim = new Simulator();

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
stdout.write("\x1b[?25l");

process.stdin.on("data", (data) => {
  if (typeof data === "string") data = Buffer.from(data);
  if (data.length === 1 && data[0] === 0x03) process.exit();
  sim.memView.setUint32(0x00ffff, data.readUIntLE(0, Math.min(data.length, 4)), true);
});

globalThis.ecall = { 1000() {} };

sim.loadVerilog(compiled);
sim.afterStep = (c) => (c === 0 ? setImmediate(sim.step) : process.exit(c));

switch (argv[2]) {
  case "stats": {
    console.clear();
    const prevAfterStep = sim.afterStep;
    sim.afterStep = (c) => {
      if (c === 0) displayStats(sim);
      prevAfterStep(c);
    };
    sim.step();
    break;
  }
  case "screen": {
    globalThis.ecall[1000] = () => {
      stdout.write("\x1b[H");
      for (let i = 0; i < 432; ++i) {
        stdout.write(`\x1b[48;5;${sim.memView.getUint8(0xa00000 + i)}m ${(i + 1) % 36 === 0 ? "\n" : ""}`);
      }
      stdout.write("\x1b[0m");
    };
    console.clear();
    sim.step();
    break;
  }
  default:
    sim.step();
}

process.on("exit", () => stdout.write("\x1b[?25h"));
