import { SearchPanel } from "./serarch-panel";
import List from "./list";
import { useDebounce, useDocumentTitle } from "../../utils/index";
import styled from "@emotion/styled";
import { Row } from "antd";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectSeachParam } from "./util";
import { ButtonNoPadding, ErrorBox } from "components/lib";

export const ProjectListScreen = () => {
  //基本类型、组件状态可以放到依赖里，非组件状态的对象绝不可以放到依赖里，否则会造成无限循环
  useDocumentTitle("项目列表", false);
  const { open } = useProjectModal();
  const [param, setParam] = useProjectSeachParam();
  /* 
  1、调用 useProjects 方法进行列表数据存储，此方法调用 useQuery(此方法返回data,error,isLoading error等状态，所以没有使用 useAsync 进行状态管理) 方法，
  
  */
  const {
    isLoading,
    error,
    data: list,
  } = useProjects(
    useDebounce(param, 2000) // 使用useDebounce来解决搜索时多次请求的问题
  );
  const { data: users } = useUsers();
  return (
    <Container>
      {/* <Helmet>
        <title>项目列表</title>
      </Helmet> */}
      <Row justify="space-between">
        <h2>项目列表</h2>
        <ButtonNoPadding onClick={open} type="link">
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};
ProjectListScreen.whyDidYouRender = false;
const Container = styled.div`
  padding: 3.2rem;
  flex: 1;
`;
