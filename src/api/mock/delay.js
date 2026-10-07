/** Simulated network latency so loading states are actually exercised. */
export function delay() {
  const ms = 250 + Math.random() * 450;
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
