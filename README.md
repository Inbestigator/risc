# RISS-V

> Reduced Instruction Set Simulator

A JS implementation of the RISC-V (RV32I) specification.

Docs: https://riscv.github.io/riscv-unified-db/manual/html/isa/isa_20240411/index.html

To inspect individual instructions, [RVCodec](https://luplab.gitlab.io/rvcodecjs/) is a great resource

```ts
import Simulator, { displayStats } from "riss-v";

const sim = new Simulator();

// 32 (0x20) is set in the x1 register
// See https://luplab.gitlab.io/rvcodecjs/#q=0x02000093 to destructure the instruction
sim.loadHex(0x02000093);
sim.step();

displayStats(sim, 0);
```

> [!INFO]
> When compiling C++, linking against the standard library may introduce instructions from RISC-V extensions beyond RV32I. RISS currently implements the RV32I base ISA only, so programs using those extensions may not run correctly.
