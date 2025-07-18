export const countArrayToMap = (countArray: any) => {
  const map = {} as any;
  countArray.forEach((item: any) => {
    const key: any = Object.keys(item).find((k) => k !== "_count");
    map[item[key]] = item._count.id;
  });
  return map;
};
