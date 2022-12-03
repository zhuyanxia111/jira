import { useHttp } from "utils/http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Epic } from "types/epic";
import { useAddConfig, useDeletConfig } from "./use-optimistic-options";
export const useEpics = (param?: Partial<Epic>) => {
  const client = useHttp();
  //useQuery存入列表数据
  return useQuery<Epic[]>(["epics", param], () =>
    client("epics", { data: param })
  );
};
export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Epic>) =>
      client(`epics`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};
//删除
export const useDeletEpic = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: "DELETE",
      }),
    useDeletConfig(queryKey)
  );
};
