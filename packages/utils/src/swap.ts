export const sleep = (time: number) => {
  return new Promise<'sleep'>(resolve => {
    setTimeout(() => {
      resolve('sleep');
    }, time);
  });
};
