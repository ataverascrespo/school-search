import { Navbar } from './Navbar';
import SavedComponent from './Saved/SavedComponent';
import SearchComponent from './SearchComponent';
import { Routes, Route, Outlet, BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Search />} />
          <Route path="list" element={<Saved />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

function Search() {
  return (
    <div className="App">
      <SearchComponent />
    </div>
  );
}

function Saved() {
  return (
    <div className="App">
      <SavedComponent />
    </div>
  );
}
