import "./App.css";
import "antd/dist/antd.css";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useHistory,
} from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import CreateBook from "./components/create-book";
import AuthorHandle from "./components/author-handle";
import Dashboard from "./components/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-book" element={<CreateBook />} />
        <Route path="/author-handle" element={<AuthorHandle />} />
      </Routes>
    </Router>
  );
}

export default App;
