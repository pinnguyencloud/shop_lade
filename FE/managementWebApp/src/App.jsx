import { ToastContainer } from "react-toastify";
import "./App.css";
import { GobalProvider } from "./contexts";
import RoutingPages from "./routings";
import "react-toastify/dist/ReactToastify.css";
import { CustomerProvider } from './contexts/accounts/customerContext';

function App() {
  return (
    <>
      <div>
        <GobalProvider>
        <CustomerProvider>
         <RoutingPages />
       </CustomerProvider>
        </GobalProvider>
        <ToastContainer autoClose={4000} position="bottom-right" />
      </div>
    </>
  );
}

export default App;
