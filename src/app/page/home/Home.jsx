import { Outlet } from "react-router-dom";
import Appbar from "@/components/appbar/Appbar";
import Footer from "@/components/footer/Footer";
import { ShopProvider } from "../../../context/ShopContext";

function Home() {
  return (
    <>
      <ShopProvider>
        <Appbar />
        <Outlet />
        <Footer />
      </ShopProvider>
    </>
  );
}

export default Home;
