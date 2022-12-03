import { useHttp } from "utils/http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Task } from "types/task";
import {
  useAddConfig,
  useDeletConfig,
  useEditConfig,
  useReorderTaskConfig,
} from "./use-optimistic-options";
import { Project } from "types/project";
import { SortProps } from "./kanban";
export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();
  //useQuery存入列表数据
  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  );
};
export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};
export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(["tasks", { id }], () => client(`tasks/${id}`), {
    enabled: Boolean(id),
  });
};
export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey) //存入数据,更新列表数据
  );
};
//删除
export const useDeletTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: "DELETE",
      }),
    useDeletConfig(queryKey)
  );
};

export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client("tasks/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderTaskConfig(queryKey));
};
