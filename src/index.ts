import RV32I from "./32I/instruction-set.ts";

type EncodedVar = `${number}` | `${number}:${number}`;

const xd = "11:7";
const xs1 = "19:15";
const xs2 = "24:20";

type Encoding = Record<string, EncodedVar | { bits: EncodedVar[]; shift: number }>;

export const encodings = {
  R: { xd, xs1, xs2 },
  I: { imm: "31:20", xd, xs1 },
  S: { imm: { bits: ["31:25", "11:7"], shift: 0 }, xs1, xs2 },
  B: { imm: { bits: ["31", "7", "30:25", "11:8"], shift: 1 }, xs1, xs2 },
  U: { imm: { bits: ["31:12"], shift: 12 }, xd },
  J: { imm: { bits: ["31", "19:12", "20", "30:21"], shift: 1 }, xd },
} satisfies Record<string, Encoding>;
export type EncodingType = keyof typeof encodings;

const decode = (binary: string, encoded: EncodedVar) =>
  encoded.includes(":")
    ? binary.slice(...encoded.split(":").map((v, i) => 31 * (1 - i) - Number(v)))
    : (binary[31 - Number(encoded)] as string);

export default class Simulator {
  public trace: { instruction: string; code: string }[] = [];
  public X = new Proxy<Record<number, number>>(Object.fromEntries(new Array(32).fill(0).map((v, i) => [i, v])), {
    set: (o, k, v) => (Number(k) === 0 ? true : Reflect.set(o, k, v)),
  });
  public pc = 0;
  private memoryBuffer = new ArrayBuffer(0xffffff);
  public memory = new Uint8Array(this.memoryBuffer);
  public memView = new DataView(this.memoryBuffer);
  constructor(memoryBuffer?: ArrayBuffer) {
    if (memoryBuffer) this.memoryBuffer = memoryBuffer;
  }
  public readonly loadVerilog = (verilog: string) => {
    const lines = verilog.split(/[\r\n]/);
    let addr = 0;
    let pcSet = false;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith("@")) {
        addr = parseInt(line.slice(1), 16);
        if (!pcSet) {
          this.pc = addr;
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
        this.memView.setUint8(addr, value);
        ++addr;
      }
    }
  };
  public readonly loadHex = (hex: string | number, addr = 0) => {
    const value = typeof hex === "number" ? hex : parseInt(hex.replace(/\s/g, ""), 16);
    this.memView.setUint32(addr, value, true);
  };
  public readonly parseInstruction = (instrNum: number) => {
    const binary = instrNum.toString(2).padStart(32, "0");
    const opcode = binary.slice(25);
    const instruction = RV32I(this).find(
      (i) =>
        i.opcode === opcode &&
        (!i.funct3 || (i.funct3 && i.funct3 === decode(binary, "14:12"))) &&
        (!i.funct7 || (i.funct7 && i.funct7 === decode(binary, "31:25"))) &&
        (!i.funct12 || (i.funct12 && i.funct12 === decode(binary, "31:20"))),
    );
    if (!instruction) throw new Error(`Unknown instruction: ${instrNum.toString(16).padStart(8, "0")}`);
    const vars = Object.entries(encodings[instruction.type]).map(([k, v]: [string, Encoding[string]]) => {
      if (typeof v === "string") {
        return [k, decode(binary, v)] as const;
      }
      return [k, v.bits.map((b) => decode(binary, b)).join("") + "0".repeat(v.shift)] as const;
    });
    return {
      instruction,
      vars: Object.fromEntries(vars.map(([k, v]) => [k, Object.assign(parseInt(v, 2), { length: v.length })])),
    };
  };
  public readonly step = () => {
    const instr = this.memView.getUint32(this.pc, true);

    try {
      const currentPc = this.pc;
      const {
        instruction,
        vars: { imm, ...vars },
      } = this.parseInstruction(instr);

      this.trace.unshift({
        instruction: instruction.mnemonic,
        imm: imm ? (imm << (32 - imm.length)) >> (32 - imm.length) : undefined,
        vars,
        code: instr.toString(16).padStart(8, "0"),
        pc: this.pc,
      } as never);

      instruction.execute({ imm, ...vars } as never);

      if (this.pc === currentPc) this.pc += 4;
      return 0;
    } catch (e) {
      if (instr !== 0) {
        console.error(e, this.pc);
        console.table(this.trace.slice(0, 10));
      }
      return 1;
    }
  };
}

export { displayStats } from "./stats.ts";
