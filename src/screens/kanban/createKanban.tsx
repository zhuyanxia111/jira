import { Input } from "antd";
import { useState } from "react";
import { useAddKanban } from "utils/kanban";
import { ColumsContainer } from ".";
import { Container } from "./kanban-colum";
import { useKanbansQueryKey, useProjectIdInUrl } from "./util";

export const CreateKanban = () => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  // mutateAsync:类似于突变，但返回一个可以等待的承诺
  const { mutateAsync: addKanban } = useAddKanban(useKanbansQueryKey());
  const submit = async () => {
    await addKanban({ name, projectId });
    setName("");
  };
  return (
    <Container>
      {/* <ColumsContainer> */}
      <Input
        size="large"
        placeholder="新建看板名称"
        onPressEnter={submit}
        onChange={(evt) => setName(evt.target.value)}
      ></Input>
      {/* </ColumsContainer> */}
    </Container>
  );
};
