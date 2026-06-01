export type EntryType = "Dev" | "Business" | "Design" | "Meeting" | "Milestone";

export interface TimelineLink {
  id: number;
  url: string;
  label: string | null;
  timeline_entry_id: number;
}

export interface TimelineEntry {
  id: number;
  title: string;
  description: string;
  type: EntryType;
  project_id: number;
  added_by_name: string;
  added_by_email: string;
  created_at: string;
  links: TimelineLink[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  org_id: number;
  created_by: number;
  created_at: string;
}
