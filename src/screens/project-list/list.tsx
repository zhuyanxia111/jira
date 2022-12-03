import { User } from "types/user";
import { Table, TableProps, Dropdown, Menu, Modal } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeletProject, useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import { useProjectsQueryKey, useProjectModal } from "./util";
import { Project } from "types/project";
interface ListProps extends TableProps<Project> {
  users: User[];
}
const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });

  return (
    <Table
      pagination={false}
      rowKey={"name"}
      columns={[
        {
          title: <Pin checked={true} disabled={true}></Pin>,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((users) => users.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render: (value, project) => {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render: (value, project) => {
            return <More key={project.id} project={project} />;
          },
        },
      ]}
      {...props}
    ></Table>
  );
};
const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deletProject } = useDeletProject(useProjectsQueryKey());
  const confirmDeletProject = (id: number) => {
    Modal.confirm({
      title: "确定删除吗?",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deletProject({ id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"edit"} onClick={editProject(project.id)}>
            编辑
          </Menu.Item>
          <Menu.Item
            key={"delet"}
            onClick={() => confirmDeletProject(project.id)}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type="link">...</ButtonNoPadding>
    </Dropdown>
  );
};
export default List;
