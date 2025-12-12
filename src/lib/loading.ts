import { createSignal } from "solid-js";

export default function useLoading(value: boolean = false) {
  const [loading, setLoading] = createSignal(value);

  // listen用来监听一个函数或者promise 当函数开始执行的是否设置loading为true 执行完成后设置loading为false
  // 需要支持同步函数和异步函数。
  const listen = <T>(
    fn: (() => T) | (() => Promise<T>),
  ): T extends Promise<infer U> ? Promise<U> : T => {
    setLoading(true);
    try {
      const result = fn();

      // 如果返回的是 Promise
      if (result instanceof Promise) {
        return result.finally(() => {
          setLoading(false);
        }) as any;
      } else {
        // 同步函数直接结束 loading
        setLoading(false);
        return result as any;
      }
    } catch (error) {
      // 同步函数出错也要结束 loading
      setLoading(false);
      throw error;
    }
  };

  return [loading, listen] as const;
}
