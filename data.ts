export const X = new Proxy(Object.fromEntries(new Array(32).fill(0).map((v, i) => [i, v])), {
  set: (o, k, v) => (Number(k) === 0 ? true : Reflect.set(o, k, v)),
});
export let pc = 0;
export const setPC = (v: number) => (pc = v);
const memoryBuffer = new ArrayBuffer(0xffffff);
export const memView = new DataView(memoryBuffer);
export const memory = new Uint8Array(memoryBuffer);
