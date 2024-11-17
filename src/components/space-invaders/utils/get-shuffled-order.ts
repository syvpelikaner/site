export function getShuffledOrder<T>(array: T[]): number[] {
  const order = Array.from({ length: array.length }, (_, index) => index);
  for (let k = order.length - 1; k > 0; k--) {
    const randomIndex = Math.floor(Math.random() * (k + 1));
    [order[k], order[randomIndex]] = [order[randomIndex], order[k]]; // Swap elements
  }

  return order;
}
