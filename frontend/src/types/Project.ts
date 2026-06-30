import { ProjectAsset } from "../types";

export interface Project {
  id: string;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  name: string;
  description: string;
  category: string;
  projectType: string;
  language: string;
  theme: "Brick Gold" | "Midnight Black" | "Royal Purple" | "Ocean Blue" | "Emerald Green";
  targetAudience: string;
  deadline: string;
  outputFormat: "PDF" | "PNG" | "JPG" | "Print Ready" | "Web Ready";
  status: "Pending" | "Completed" | "In Progress" | "Not Started" | "On Hold" | "Archived";
  isPinned: boolean;
  assets: ProjectAsset[];
}
