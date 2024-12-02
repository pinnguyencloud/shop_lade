import "./App.css";
import { GobalProvider } from "./contexts";
import RoutingPages from "./routings";

function App() {
  return (
    <>
      <div>
        <GobalProvider>
          <RoutingPages />
        </GobalProvider>
      </div>
    </>
  );
}

export default App;
