import React, { lazy } from "react";
import TabsSection from "sections/Homepage/TabsSection";

const Header = lazy(() => import("components/CommonHeader/Header"));
const Footer = lazy(() => import("components/CommonFooter/Footer"));

const DashboardLayout = ({ children }) => {
  return (
    <div className="site-container">
      <Header page={"authenticated"}/>
      <TabsSection />
      <div className="main-inner-contianer">{children}</div>
      <Footer/>
    </div>
  );
};
export default DashboardLayout;
