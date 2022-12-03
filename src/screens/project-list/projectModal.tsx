import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { ErrorBox } from "components/lib";
import { UserSelect } from "components/user-select";
import React, { useEffect } from "react";
import { useAddProject, useEditProject } from "utils/project";
import { useProjectsQueryKey, useProjectModal } from "./util";
export const ProjectModal = () => {
  const { projectModalOpen, close, editProject, isLoading, editingProjectId } =
    useProjectModal();
  // useEditProject:请求并返回
  const useMutateProject = editingProjectId ? useEditProject : useAddProject;
  // mutateAsync:类似于突变，但返回一个可以等待的承诺
  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectsQueryKey());
  const [form] = useForm();
  const onFinish = (values: any) => {
    mutateAsync({ ...editProject, ...values }).then(() => {
      form.resetFields();
      close();
    });
  };
  const closeModal = () => {
    form.resetFields();
    close();
  };
  const title = editingProjectId ? "编辑项目" : "创建项目";
  useEffect(() => {
    form.setFieldsValue(editProject);
  }, [editProject, form]);
  return (
    <Drawer
      forceRender={true}
      title={title}
      onClose={closeModal}
      width={"100%"}
      open={projectModalOpen}
    >
      <Container>
        {isLoading ? (
          <Spin />
        ) : (
          <>
            <h1>{title}</h1>
            <ErrorBox error={error}></ErrorBox>
            <Form
              layout={"vertical"}
              style={{ width: "40rem" }}
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                label={"名称"}
                name={"name"}
                rules={[{ required: true, message: "请输入项目名" }]}
              >
                <Input placeholder={"请输入项目名称"}></Input>
              </Form.Item>
              <Form.Item
                label={"部门"}
                name={"organization"}
                rules={[{ required: true, message: "请输入部门名" }]}
              >
                <Input placeholder={"请输入部门名"}></Input>
              </Form.Item>
              <Form.Item label={"负责人"} name={"personId"}>
                <UserSelect defaultOptionName={"负责人"}></UserSelect>
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  loading={mutateLoading}
                  type={"primary"}
                  htmlType={"submit"}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {/* <Button onClick={close}>关闭</Button> */}
      </Container>
    </Drawer>
  );
};
const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
