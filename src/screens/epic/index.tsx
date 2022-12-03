import React, { useEffect, useState } from "react";
import { Row, ScreenContainer } from "components/lib";
import { useProjectInUrl } from "screens/kanban/util";
import { useDeletEpic, useEpics } from "utils/epic";
import { useEpicSearchParams, useEpicsQueryKey } from "./util";
import { Button, List } from "antd";
import dayjs from "dayjs";
import { useTasks } from "utils/task";
import { Link } from "react-router-dom";
import { CreactEpic } from "./creat-epic";
import { Modal } from "antd";
import { Epic } from "types/epic";
export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl(); //获取当前任务名称
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deletEpic } = useDeletEpic(useEpicsQueryKey());
  const [epicCreatOpen, setEpicCreatOpen] = useState(false);
  const confirmDeletEpic = (epic: Epic) => {
    Modal.confirm({
      title: "确定删除任务组：" + epic.name,
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deletEpic({ id: epic.id });
      },
    });
  };
  return (
    <ScreenContainer>
      <Row between>
        <h1>{currentProject?.name}任务组</h1>
        <Button onClick={() => setEpicCreatOpen(true)}>创建任务组</Button>
      </Row>
      <List
        dataSource={epics}
        itemLayout={"vertical"}
        style={{ overflowY: "scroll" }}
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row>
                  <span>{epic.name} </span>
                  <Button type={"link"} onClick={() => confirmDeletEpic(epic)}>
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间: {dayjs(epic.start).format("YYYY-MM-DD")} </div>
                  <div>结束时间:{dayjs(epic.end).format("YYYY-MM-DD")} </div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    key={task.id}
                    to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                  >
                    {task.name}{" "}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
      <CreactEpic
        open={epicCreatOpen}
        onClose={() => setEpicCreatOpen(false)}
      />
    </ScreenContainer>
  );
};
