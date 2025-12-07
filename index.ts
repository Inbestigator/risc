import { emitKeypressEvents } from "node:readline";
import { memView, pc, setPC } from "./data";
import { is } from "./instruction-set";
import { stdout } from "bun";

type EncodedVar = `${number}` | `${number}:${number}`;

const xd = "11:7";
const xs1 = "19:15";
const xs2 = "24:20";

type Encoding = Record<string, EncodedVar | { bits: EncodedVar[]; shift: number }>;
export type EncodingType = keyof typeof encodings;

export const encodings = {
  R: { xd, xs1, xs2 },
  I: { imm: "31:20", xd, xs1 },
  S: {
    imm: { bits: ["31:25", "11:7"], shift: 0 },
    xs1,
    xs2,
  },
  B: {
    imm: { bits: ["31", "7", "30:25", "11:8"], shift: 1 },
    xs1,
    xs2,
  },
  U: {
    imm: { bits: ["31:12"], shift: 12 },
    xd,
  },
  J: { imm: { bits: ["31", "19:12", "20", "30:21"], shift: 1 }, xd },
} satisfies Record<string, Encoding>;

function decode(binary: string, encoded: EncodedVar) {
  return encoded.includes(":")
    ? binary.slice(...encoded.split(":").map((v, i) => 31 * (1 - i) - Number(v)))
    : binary[31 - Number(encoded)]!;
}

function parse(instrNum: number) {
  const binary = instrNum.toString(2).padStart(32, "0");
  const opcode = binary.slice(25);
  const instruction = is.find(
    (i) =>
      i.opcode === opcode &&
      (!i.funct3 || (i.funct3 && i.funct3 === decode(binary, "14:12"))) &&
      (!i.funct7 || (i.funct7 && i.funct7 === decode(binary, "31:25"))) &&
      (!i.funct12 || (i.funct12 && i.funct12 === decode(binary, "31:20")))
  );
  if (!instruction) throw `Unknown instruction: ${instrNum.toString(16).padStart(8, "0")}`;
  const vars = Object.entries(encodings[instruction.type]).map(
    ([k, v]: [string, Encoding[string]]) => {
      if (typeof v === "string") {
        return [k, decode(binary, v)] as const;
      }
      return [k, v.bits.map((b) => decode(binary, b)).join("") + "0".repeat(v.shift)] as const;
    }
  );
  return {
    instruction,
    vars: Object.fromEntries(
      vars.map(([k, v]) => [k, Object.assign(parseInt(v, 2), { length: v.length })])
    ),
  };
}

function loadVerilogHex(hex: string) {
  const lines = hex.split(/[\r\n]/);
  let addr = 0;
  let pcSet = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith("@")) {
      addr = parseInt(line.slice(1), 16);
      if (!pcSet) {
        setPC(addr);
        pcSet = true;
      }
      continue;
    }

    const bytes = line.split(/\s+/);
    for (const byteStr of bytes) {
      if (byteStr === "") continue;
      const value = parseInt(byteStr, 16);
      if (Number.isNaN(value)) {
        throw new Error(`Invalid hex byte: ${byteStr}`);
      }
      memView.setUint8(addr, value);
      ++addr;
    }
  }
}

const trace: { instruction: string; code: string }[] = [];

process.on("exit", () => stdout.write("\x1b[?25h"));

export function run(strings: TemplateStringsArray | string | string[], callback?: () => void) {
  loadVerilogHex(strings.toString().replaceAll(",", ""));

  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  stdout.write("\x1b[?25l");

  process.stdin.on("data", (data) => {
    if (data.length === 1 && data[0] === 0x03) process.exit();
    memView.setUint32(0x00ffff, data.readUIntLE(0, Math.min(data.length, 4)), true);
  });

  function step() {
    const instr = memView.getUint32(pc, true);

    try {
      const currentPc = pc;
      const {
        instruction,
        vars: { imm, ...vars },
      } = parse(instr);

      trace.unshift({
        instruction: instruction.mnemonic,
        imm: imm ? (imm << (32 - imm.length)) >> (32 - imm.length) : undefined,
        vars,
        code: instr.toString(16).padStart(8, "0"),
        pc,
      } as never);

      instruction.execute({ imm, ...vars } as never);

      if (pc === currentPc) setPC(pc + 4);

      callback?.();
    } catch (e) {
      if (instr !== 0) {
        console.error(e, pc);
        console.table(trace.slice(0, 10));
      }
      process.exit(1);
    }
    setImmediate(step);
  }

  step();
}
