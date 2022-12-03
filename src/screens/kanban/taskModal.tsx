import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { Modal } from "antd";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeletTask, useEditTask } from "utils/task";
import { useTasksModal, useTasksQueryKey } from "./util";
const layout = {
  labelCol: { span: 8 },
  // wrapperCal: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTaskId, editingTask, close } = useTasksModal();
  const onCancel = () => {
    close();
    form.resetFields();
  };
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );
  const onOk = () =>
    editTask({ ...editingTask, ...form.getFieldsValue() }).then(close);
  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);
  const { mutateAsync } = useDeletTask(useTasksQueryKey());
  const startDelet = () => {
    close();
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除任务",
      onOk() {
        return mutateAsync({ id: Number(editingTaskId) });
      },
    });
  };
  return (
    <Modal
      forceRender
      okText={"确认"}
      cancelText={"取消"}
      confirmLoading={editLoading}
      title={"编辑任务"}
      open={!!editingTaskId}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item
          label={"任务名"}
          name={"name"}
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"经办人"} name={"processorId"}>
          <UserSelect defaultOptionName="经办人" />
        </Form.Item>
        <Form.Item label={"类型"} name={"typeId"}>
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button onClick={startDelet} size="small">
          删除
        </Button>
      </div>
    </Modal>
  );
};
