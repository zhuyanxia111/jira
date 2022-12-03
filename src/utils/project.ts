import { useHttp } from "utils/http";
import { Project } from "types/project";
import { QueryKey, useMutation, useQuery } from "react-query";
import {
  useAddConfig,
  useDeletConfig,
  useEditConfig,
} from "./use-optimistic-options";
/* 
整个逻辑 ：
1、在 tsx 页面通过 useProjectsQueryKey 方法获取 queryKey,调用 useEditProject 、 useAddProject 、 useDeletProject（这些方法 return 了 useMutation 方法，）等方法，里面的 useMutation 第一个参数调用了 useHttp 进行接口调用，第二个参数使用乐观更新方法

2、在调用接口前会触发 (useDeletConfig 、 useEditConfig 、 useAddConfig) 里面封装的乐观更新方法（onMutate），

3、根据 useDeletConfig 、 useEditConfig 、 useAddConfig 封装的不同增删改方法传入作为函数传入到 useConfig 里面

4、 onMutate 接收 callback ,并在里面使用 queryClient.setQueryData

5、返回 callback （增删改回调函数处理后）的值作为 setQueryData 更新的值，更新列表数据，返回未更新的列表数据作为 onError 的回滚数据（异步请求失败回滚）

*/
//搜索，功能未涉及乐观更新
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  //useQuery存入列表数据
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};
//编辑：传入queryKey到乐观更新函数进行更新，
export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey) //存入数据,更新列表数据
  );
};
//新增
export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};
//删除
export const useDeletProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeletConfig(queryKey)
  );
};
export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>([], () => client(`projects/${id}`), {
    enabled: Boolean(id),
  });
};
