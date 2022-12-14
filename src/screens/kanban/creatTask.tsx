import { Input } from "antd";
import Card from "antd/lib/card/Card";
import { useEffect, useState } from "react";
import { useAddTask } from "utils/task";
import { useProjectIdInUrl, useTasksQueryKey } from "./util";

export const CreatTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());
  const [inputMode, setInputMode] = useState(false);
  const projectId = useProjectIdInUrl();
  const submit = () => {
    addTask({ name, projectId, kanbanId }).then((res) => {
      setInputMode(false);
      setName("");
    });
  };
  const toggle = () => setInputMode(!inputMode);
  useEffect(() => {
    if (!inputMode) {
      setName("");
    }
  }, [inputMode]);
  if (!inputMode) {
    return <div onClick={toggle}>+创建事务</div>;
  }
  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder={"需要做些什么"}
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      ></Input>
    </Card>
  );
};
