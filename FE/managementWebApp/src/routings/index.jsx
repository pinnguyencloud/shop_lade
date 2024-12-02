import { RouterProvider } from "react-router-dom";
import router from "./routingList";

function RoutingPages() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default RoutingPages;
