/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "../../../shared/hooks/useSidebar";

function SidebarContext({ children }) {
  const { pathname } = useLocation();
  return <SidebarProvider defaultItem={pathname}>{children}</SidebarProvider>;
}
export default SidebarContext;
