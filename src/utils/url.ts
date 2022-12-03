import { useMemo, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { clearObject } from "utils/index";
//返回页面url中指定键的参数值
//传入泛型：传入的key是什么类型就返回什么类型
/* 获取地址url中的参数 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParams();
  const [stateKeys] = useState(keys);
  return [
    // useMemo：返回一个memoized的值,只有当一个依赖项改变的时候才会发生变化，否则拿缓存的值，就不用在每次渲染的时候再做计算
    useMemo(
      () =>
        // 循环后返回会造成返回的是新的值：‘js的引用类型和基本类型的问题’，造成无限循环
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
          //as { [key in K]: string } 指定返回的key值类型为传入的key值泛类型本身
        }, {} as { [key in K]: string }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams, stateKeys]
    ),
    //限制修改的key值只能是查询的key值,value是unknown
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
    },
  ] as const;
};
/* 设置url中的参数 */
export const useSetUrlSearchParams = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = clearObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
