import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import SiteFooter from "./Components/SiteFooter";

export default function Layout() {
  return (
    <div className="site-layout">
      <Header />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
