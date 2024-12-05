import { ToastContainer } from "react-toastify";
import "./App.css";
import { GobalProvider } from "./contexts";
import RoutingPages from "./routings";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div>
        <GobalProvider>
          <RoutingPages />
        </GobalProvider>
        <ToastContainer autoClose={4000} position="bottom-right" />
      </div>
    </>
  );
}

export default App;
