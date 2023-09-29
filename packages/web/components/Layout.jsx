import React from "react";
import Footer from "./Footer";
import TopBar from "./TopBar";

function Layout({ children, showFooter }) {
  return (
    <div className="w-full transition-all scroll-smooth relative h-auto overflow-y-scroll bg-white-100 hideScrollBar">
      <TopBar />
      {children}
      {showFooter && <Footer />}
    </div>
  );
}

export default Layout;
