export interface Task {
  uuid: string;
  status: Status;
  title: string;
  description: string | null;
  deadline: string | null;
  createdAt: string;
}

export interface Status {
  code: string;
  name: string;
}