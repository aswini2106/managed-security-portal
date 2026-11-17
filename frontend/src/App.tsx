import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Vulnerabilities from "./pages/Vulnerabilities";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vulnerabilities" element={<Vulnerabilities />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
