// 乐观更新的数据没有id所以会导致列表报错 "list should have a unique "key" prop" 没有key
import { QueryKey, useQueryClient } from "react-query";
import { Project } from "types/project";
import { Task } from "types/task";
import { reorder } from "./reorder";
// react-query官网:https://react-query-v2.tanstack.com/reference/QueryClient#queryclientsetquerydata
export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[] | undefined) => any[] //动态传入删改增操作
) => {
  const queryClient = useQueryClient(); //useQueryClient更新数据
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    //onMutate是在useMutation一发生就调用
    async onMutate(target: any) {
      // onMutate是useMutation里面的方法 该函数将在触发突变函数之前触发，并传递给突变函数将接收的相同变量对资源执行乐观更新很有用，希望突变成功在突变失败的情况下，从这个函数返回的值将被传递给onError和onsettle函数，这对于回滚乐观更新很有用。
      const previousItems = queryClient.getQueryData(queryKey); //通过key获取当前的列表数据

      /*
       *queryClient.setQueryData
       *If non-function is passed, the data will be updated to this value 如果传入非函数，则数据将更新为此值
       *If a function is passed, it will receive the old data value and be expected to return a new one.如果传递了一个函数，它将接收旧的数据值（old）并返回一个新值，例：setQueryData(queryKey, oldData => newData)
       * */
      queryClient.setQueryData(
        queryKey,
        (old?: any[]) => {
          //target当前修改的列表对象
          return callback(target, old);
        } // callback必须返回新值，否则会导致setQueryData没有接收到需要存入的数据
      );
      return { previousItems }; //返回previousItems是因为需要异步失败回滚
    },
    //在useMutation异步失败的时候，需要回滚
    onError(
      error: any,
      newItem: any,
      context: any //onMutate返回的东西都在context里面
    ) {
      queryClient.setQueryData(
        queryKey,
        (context as { previousItems: Project[] }).previousItems
      );
    },
  };
};

export const useDeletConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target: any, old?: any[] | undefined) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));
export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
