import Simulator, { displayStats } from "riss-v";

const sim = new Simulator();

sim.loadHex(0x02000093);
sim.step();

displayStats(sim, 0);
