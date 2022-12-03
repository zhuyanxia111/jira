export interface Task {
  id: number;
  name: string;
  //经办人
  processorId: number;
  projectId: number;
  epicId: number; //任务组
  kanbanId: number;
  typeId: number;
  note: string;
}
