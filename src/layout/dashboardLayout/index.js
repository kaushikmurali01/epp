import React, { lazy } from "react";
import TabsSection from "sections/Homepage/TabsSection";

const Header = lazy(() => import("components/CommonHeader/Header"));
const Footer = lazy(() => import("components/CommonFooter/Footer"));

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <Header page={"authenticated"}/>
      <TabsSection />
      <div className="overflow-auto flex-1">{children}</div>
      <Footer/>
    </div>
  );
};
export default DashboardLayout;
