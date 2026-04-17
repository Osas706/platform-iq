import { useUser } from "@clerk/react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";
import Session from "./pages/Session";

import { Toaster } from "react-hot-toast";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <Home /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to={"/"} />} />


        <Route path="/problems" element={isSignedIn ? <Problems /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <Problem /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <Session /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;