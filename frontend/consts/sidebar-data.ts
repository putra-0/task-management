import { ClipboardList, LayoutDashboard, LucideIcon } from "lucide-react";

export interface NavMainGroupProps {
  groups: {
    title: string;
    url: string;
    items: Items[];
  }[];
}

export type Items = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: Item[];
};

export type Item = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export const MenuPaths: NavMainGroupProps["groups"] = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Task",
        url: "/tasks",
        icon: ClipboardList,
      },
    ],
  },
];
