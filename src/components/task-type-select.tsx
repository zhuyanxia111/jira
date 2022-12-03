import React from "react";
import { IdSelect } from "./id-select";
import { useTaskTypes } from "utils/taskType";
export const TaskTypeSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data: taskTypes } = useTaskTypes();
  return <IdSelect options={taskTypes || []} {...props} />;
};
