import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";

function LayoutRouter() {
  return (
    <div className="bg-secondGray bg-opacity-80">
      <Navbar />
      <Header />
      <div className="w-full pl-[290px] pr-10 h-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutRouter;
