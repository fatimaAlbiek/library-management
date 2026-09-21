import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import EditBook from "./pages/EditBook";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/edit-book/:id" element={<EditBook />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;