import Simulator from "../../src/index.ts";

export async function POST(req: Request) {
  const params = new URL(req.url).searchParams;
  const memSize = parseInt(params.get("mem") ?? (0xffffff).toString(), 10);
  const cycles = parseInt(params.get("cycles") ?? "1", 10);

  const sim = new Simulator({ memory: new ArrayBuffer(memSize) });
  sim.loadVerilog(await req.text());

  let exitedEarly = false;

  for (let i = 0; i < cycles; ++i) {
    if (sim.step()) {
      exitedEarly = true;
      break;
    }
  }

  const X = Object.values(sim.X);
  const memory = sim.memory;
  const trace = exitedEarly ? sim.trace.slice(0, 16) : [];
  const traceBytes = new TextEncoder().encode(JSON.stringify(trace));
  const buffer = new ArrayBuffer(1 + 4 + 32 * 4 + 4 + memory.byteLength + 4 + traceBytes.byteLength);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  let offset = 0;

  // Exit code
  view.setUint8(offset, exitedEarly ? 1 : 0);
  offset += 1;

  // PC
  view.setUint32(offset, sim.pc, true);
  offset += 4;

  // Registers
  for (const value of X) {
    view.setUint32(offset, value, true);
    offset += 4;
  }

  // Memory
  view.setUint32(offset, memory.byteLength, true);
  offset += 4;

  bytes.set(memory, offset);
  offset += memory.byteLength;

  // Trace
  view.setUint32(offset, traceBytes.byteLength, true);
  offset += 4;

  bytes.set(traceBytes, offset);

  const compressed = new Blob([buffer]).stream().pipeThrough(new CompressionStream("brotli" as never));

  return new Response(compressed, {
    headers: { "Content-Type": "application/octet-stream", "Content-Encoding": "br" },
  });
}
