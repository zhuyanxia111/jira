import { useHttp } from "utils/http";
import { useQuery } from "react-query";
import { TaskType } from "types/task-type";
//获取任务类型添加不太的icon
export const useTaskTypes = () => {
  const client = useHttp();
  //useQuery存入列表数据
  return useQuery<TaskType[]>(["tasksTypes"], () => client("taskTypes"));
};
