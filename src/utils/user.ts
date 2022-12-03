import { useQuery } from "react-query";
import { User } from "types/user";
import { useHttp } from "utils/http";
//useUsers这个方法在选择人的下拉中使用
//搜索，功能未涉及乐观更新
export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();
  //useQuery存入列表数据
  return useQuery<User[]>(["users", param], () =>
    client("users", { data: param })
  );
};
