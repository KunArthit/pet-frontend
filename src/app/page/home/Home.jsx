import { Outlet } from "react-router-dom";
import Appbar from "@/components/appbar/Appbar";
import Footer from "@/components/footer/Footer";

function Home() {
  return (
    <>
      <Appbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Home;
