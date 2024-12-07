import ToastNotifyWrapper from "@components/toast-notify";
import router from "@layouts/router";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastNotifyWrapper />
    </>
  );
}

export default App;
