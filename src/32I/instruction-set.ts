import type { EncodingType, encodings, default as Simulator } from "../index.ts";
import codes from "./codes.ts";

export interface Instruction<T extends EncodingType> {
  execute: (
    args: {
      [K in keyof (typeof encodings)[T]]: K extends `x${string}` ? string : number & { length: number };
    },
  ) => void;
  mnemonic: string;
  type: T;
  opcode: string;
  funct3?: string;
  funct7?: string;
  funct12?: string;
}

const i = <T extends EncodingType>(v: Instruction<T>) => v;

export default function (sim: Simulator) {
  const jump = (target_hw_addr: number) => (sim.pc = target_hw_addr);

  function jumpHalfword(target_hw_addr: number) {
    if ((target_hw_addr & 0x1) !== 0x0) throw new Error("Expected halfword-aligned address in jumpHalfword");
    jump(target_hw_addr);
  }

  const signed = Object.assign((v: number & { length: number }) => (v << (32 - v.length)) >> (32 - v.length), {
    X: (x: keyof Simulator["X"]) => (sim.X[x] << 0) >> 0,
  });
  const wrapMem = (a: number) => ((a % sim.memory.length) + sim.memory.length) % sim.memory.length;

  return [
    i({ ...codes.lui, execute: ({ imm, xd }) => (sim.X[xd] = signed(imm)) }),
    i({ ...codes.auipc, execute: ({ imm, xd }) => (sim.X[xd] = sim.pc + signed(imm)) }),
    i({
      ...codes.jal,
      execute({ imm, xd }) {
        const returnAddr = sim.pc + 4;
        jumpHalfword(sim.pc + signed(imm));
        sim.X[xd] = returnAddr;
      },
    }),
    i({
      ...codes.jalr,
      execute({ imm, xd, xs1 }) {
        const returnAddr = sim.pc + 4;
        jump((sim.X[xs1] + signed(imm)) & ~1);
        sim.X[xd] = returnAddr;
      },
    }),
    i({
      ...codes.beq,
      execute: ({ imm, xs1, xs2 }) => sim.X[xs1] === sim.X[xs2] && jumpHalfword(sim.pc + signed(imm)),
    }),
    i({
      ...codes.bne,
      execute: ({ imm, xs1, xs2 }) => sim.X[xs1] !== sim.X[xs2] && jumpHalfword(sim.pc + signed(imm)),
    }),
    i({
      ...codes.blt,
      execute: ({ imm, xs1, xs2 }) => signed.X(xs1) < signed.X(xs2) && jumpHalfword(sim.pc + signed(imm)),
    }),
    i({
      ...codes.bge,
      execute: ({ imm, xs1, xs2 }) => signed.X(xs1) >= signed.X(xs2) && jumpHalfword(sim.pc + signed(imm)),
    }),
    i({
      ...codes.bltu,
      execute: ({ imm, xs1, xs2 }) => sim.X[xs1] < sim.X[xs2] && jumpHalfword(sim.pc + signed(imm)),
    }),
    i({
      ...codes.bgeu,
      execute: ({ imm, xs1, xs2 }) => sim.X[xs1] >= sim.X[xs2] && jumpHalfword(sim.pc + signed(imm)),
    }),
    i({
      ...codes.lb,
      execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.memView.getInt8(wrapMem(sim.X[xs1] + signed(imm)))),
    }),
    i({
      ...codes.lh,
      execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.memView.getInt16(wrapMem(sim.X[xs1] + signed(imm)), true)),
    }),
    i({
      ...codes.lw,
      execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.memView.getInt32(wrapMem(sim.X[xs1] + signed(imm)), true)),
    }),
    i({
      ...codes.lbu,
      execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.memView.getUint8(wrapMem(sim.X[xs1] + signed(imm)))),
    }),
    i({
      ...codes.lhu,
      execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.memView.getUint16(wrapMem(sim.X[xs1] + signed(imm)), true)),
    }),
    i({
      ...codes.sb,
      execute: ({ imm, xs1, xs2 }) => sim.memView.setInt8(wrapMem(sim.X[xs1] + signed(imm)), sim.X[xs2] & 0xff),
    }),
    i({
      ...codes.sh,
      execute: ({ imm, xs1, xs2 }) =>
        sim.memView.setInt16(wrapMem(sim.X[xs1] + signed(imm)), sim.X[xs2] & 0xffff, true),
    }),
    i({
      ...codes.sw,
      execute: ({ imm, xs1, xs2 }) => sim.memView.setInt32(wrapMem(sim.X[xs1] + signed(imm)), sim.X[xs2], true),
    }),
    i({ ...codes.addi, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] + signed(imm)) }),
    i({
      ...codes.slti,
      execute: ({ imm, xd, xs1 }) => (sim.X[xd] = signed.X(xs1) < signed(imm) ? 1 : 0),
    }),
    i({ ...codes.sltiu, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] < signed(imm) ? 1 : 0) }),
    i({ ...codes.xori, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] ^ signed(imm)) }),
    i({ ...codes.ori, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] | signed(imm)) }),
    i({ ...codes.andi, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] & signed(imm)) }),
    i({ ...codes.slli, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] << (imm & 0xf)) }),
    i({ ...codes.srli, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] >> (imm & 0xf)) }),
    i({ ...codes.srai, execute: ({ imm, xd, xs1 }) => (sim.X[xd] = sim.X[xs1] >>> (imm & 0xf)) }),
    i({ ...codes.add, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] + sim.X[xs2]) }),
    i({ ...codes.sub, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] - sim.X[xs2]) }),
    i({ ...codes.sll, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] << (sim.X[xs2] & 0xf)) }),
    i({
      ...codes.slt,
      execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = signed.X(xs1) < signed.X(xs2) ? 1 : 0),
    }),
    i({ ...codes.sltu, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] < sim.X[xs2] ? 1 : 0) }),
    i({ ...codes.xor, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] ^ sim.X[xs2]) }),
    i({ ...codes.srl, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] >> (sim.X[xs2] & 0xf)) }),
    i({ ...codes.sra, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] >>> (sim.X[xs2] & 0xf)) }),
    i({ ...codes.or, execute: ({ xd, xs1, xs2 }) => (sim.X[xd] = sim.X[xs1] | sim.X[xs2]) }),
    i({
      ...codes.ecall,
      execute() {
        const sys = sim.X[17];
        globalThis.ecall[403] = () => {
          const clock_id = sim.X[10]; // a0
          const tp = sim.X[11]; // a1 (pointer)

          const ms = (clock_id === 1 ? performance : Date).now();
          //                           ^ monotonic   ^ realtime

          const sec = Math.floor(ms / 1000);
          const nsec = Math.floor((ms % 1000) * 1e6);

          sim.memView.setInt32(wrapMem(tp), sec, true);
          sim.memView.setInt32(wrapMem(tp + 4), nsec, true);

          sim.X[10] = 0;
        };

        if (globalThis.ecall[sys]) globalThis.ecall[sys]();
        else if (sys === 93) {
          console.info(`Program exited with code ${sim.X[10]}`);
          throw "ProgramExit";
        } else throw `Unknown ECALL: ${sys}`;
      },
    }),
    i({
      ...codes.ebreak,
      execute() {
        throw "Ebreak";
      },
    }),
  ] as const;
}
declare global {
  var ecall: Record<number, () => void>;
}
