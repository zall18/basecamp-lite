export type RoleType =
  | "LEAD"
  | "LOGISTICS"
  | "CONSUMPTION"
  | "STAGE_EVENT"
  | "MEDIA_DOCS"
  | "PUBLIC_RELATIONS"
  | "VOLUNTEER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export type ItemStatus = "NOT_PICKED_UP" | "ON_THE_WAY" | "DELIVERED" | "RETURNED";

export interface EventMember {
  id: string;
  eventId: string;
  name: string;
  phone?: string | null;
  role: RoleType;
  customTag?: string | null;
  tasks?: Task[];
  logistics?: LogisticsItem[];
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  assigneeId?: string | null;
  status: TaskStatus;
  deadline?: Date | string | null;
  lastNudgeAt?: Date | string | null;
  lastNudgeBy?: string | null;
  assignee?: EventMember | null;
}

export interface LogisticsItem {
  id: string;
  eventId: string;
  name: string;
  category: string;
  status: ItemStatus;
  picId?: string | null;
  vendorPhone?: string | null;
  photoProof?: string | null;
  pic?: EventMember | null;
}

export interface RundownItem {
  id: string;
  eventId: string;
  order: number;
  title: string;
  speaker?: string | null;
  startTime: Date | string;
  endTime: Date | string;
  cueNotes?: string | null;
  isCurrent: boolean;
}

export interface QuickAsset {
  id: string;
  eventId: string;
  title: string;
  url: string;
  category: string;
}

export interface SosAlert {
  id: string;
  eventId: string;
  message: string;
  senderName: string;
  isResolved: boolean;
  createdAt: Date | string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  senderName: string;
  timestamp: Date | string;
  read: boolean;
  type: "nudge" | "sos" | "rundown" | "logistics";
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  isPublic: boolean;
  passcode?: string | null;
  date: Date | string;
  location?: string | null;
  wifiSSID?: string | null;
  wifiPass?: string | null;
  members: EventMember[];
  tasks: Task[];
  logistics: LogisticsItem[];
  rundowns: RundownItem[];
  assets: QuickAsset[];
  sosAlerts: SosAlert[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
