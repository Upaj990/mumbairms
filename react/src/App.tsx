import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Login,Home, Error } from "./app/layouts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<Home/>} />
        <Route path="*" element={<Error/>} />
      </Routes>
    </Router>
  );
}

export default App;