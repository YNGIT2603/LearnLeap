import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home"

function App() {
  return (
    <div className='w-screen min-h-screen flex flex-col bg-richblack-900 font-inter'>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </div>
  );
}

export default App;
