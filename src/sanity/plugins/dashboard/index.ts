import { definePlugin } from "sanity";
import { DashboardIcon } from "@sanity/icons";

import { DashboardTool } from "./DashboardTool";

export const dashboardTool = definePlugin({
  name: "allan-dashboard",
  tools: (prev) => [
    { name: "dashboard", title: "Dashboard", icon: DashboardIcon, component: DashboardTool },
    ...prev,
  ],
});
