import { BrowserRouter } from "react-router-dom";

const RouterProvider: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}

export default RouterProvider;