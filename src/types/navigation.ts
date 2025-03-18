
import { ComponentType } from "react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
}
