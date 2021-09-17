import React from "react";
import "./PageContainer.css";

import LeftDrawerWithData from "./LeftDrawerWithData";
import MainContentWithData from "./MainContentWithData";

export default function PageContainer(props) {
  return (
    <div className="page-container">
      <LeftDrawerWithData />
      <MainContentWithData />
    </div>
  );
}
