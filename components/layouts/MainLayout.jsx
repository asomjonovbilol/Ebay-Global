"use client";

import TopMenu from "./_includes/TopMenu";
import MainHeader from "./_includes/MainHeader";
import SubMenu from "./_includes/SubMenu";
import Footer from "./_includes/Footer";
import { useEffect, useState } from "react";
import Loading from "../Loading";

const MainLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("storage", function () {
      let res = this.localStorage.getItem("isLoading");
      res === "false" ? setIsLoading(false) : setIsLoading(true);
    });
  }, []);

  return (
    <>
      <div id="MainLayout" className="min-w-[1050px] max-w-[1300px] mx-auto">
        <div>
          {isLoading ? <Loading /> : <div></div>}
          <TopMenu />
          <MainHeader />
          <SubMenu />
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
