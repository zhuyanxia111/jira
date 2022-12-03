import { useEffect, useRef, useState } from "react";
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
export const clearObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};
//在进入页面第一次的时候运行
export const useMount = (calback: () => void) => {
  useEffect(() => {
    calback();
    //TODO 依赖项里加上callback会造成无限循环，这个和usecallback以及userMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
export const useDebounce = <V>(value: V, delay?: number): V => {
  const [debouceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    //每次在value变化后设置一个定时器
    const timeOut = setTimeout(() => setDebounceValue(value), delay);
    //每次在上一个useEffect处理完后再运行，useEffect通过return进行一些清除
    return () => clearTimeout(timeOut);
  }, [value, delay]);
  return debouceValue;
};
//react hook和闭包经典的坑
export const useDocumentTitle = (
  titile: string,
  keepOnUnmount: boolean = true
) => {
  //页面加载时旧title
  //加载后新title
  let oldTitle = useRef(document.title).current; //useRef保存的值在整个生命周期都不会变
  useEffect(() => {
    document.title = titile;
  }, [titile]);
  useEffect(() => {
    //return会在卸载时调用
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
    //如果不指定依赖，读到的就是旧title
  }, [keepOnUnmount, oldTitle]);
};
export const resetRoute = () => (window.location.href = window.location.origin);
export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};
