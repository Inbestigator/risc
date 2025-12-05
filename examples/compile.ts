import { $ } from "bun";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function compile(address: string) {
  const tmpPath = join(tmpdir(), `${address}.elf`);
  const hexPath = tmpPath.replace(/elf$/, "hex");
  await $`riscv64-unknown-elf-g++ -march=rv32i -mabi=ilp32 -nostartfiles start.s ${address} -o ${tmpPath}`;
  await $`riscv64-unknown-elf-objcopy -O verilog ${tmpPath} ${hexPath}`;
  return (await readFile(hexPath)).toString();
}
