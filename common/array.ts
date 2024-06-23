export const array = (arr: any[]) =>
  new Proxy(arr, {
    get(target, prop, receiver) {
      const convertedProp = Number(prop);

      if (convertedProp < 0) {
        const length = target.length;
        return target[length + convertedProp];
      }

      return target[convertedProp];
    },
  });

// const test = array([1, 2, 3, 4, 5, 6]);
// test[-2] // 5
