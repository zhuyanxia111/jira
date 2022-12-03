import { useMemo } from "react";
import { useProject } from "utils/project";
import { useSetUrlSearchParams, useUrlQueryParam } from "utils/url";

export const useProjectSeachParam = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [param] = useProjectSeachParam();
  return ["projects", param];
};

export const useProjectModal = () => {
  const [{ projectCreat }, setProjectModalOpen] = useUrlQueryParam([
    "projectCreat",
    "editingProjectId",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
    "projectCreat",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const { data: editProject, isLoading } = useProject(Number(editingProjectId));
  const open = () => setProjectModalOpen({ projectCreat: true });
  const close = () => {
    setUrlParams({ editingProjectId: "", projectCreat: undefined });
  };
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });
  return {
    //改变判断modal条件以实现不需要
    projectModalOpen: projectCreat === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editProject,
    isLoading,
    editingProjectId,
  };
};
