export const runOnJS =
  <Args extends unknown[], Return>(function_: (...args: Args) => Return) =>
  (...args: Args): Return =>
    function_(...args);
