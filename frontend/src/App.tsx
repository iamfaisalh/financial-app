import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { validateUserAuthThunk } from "./redux/reducers/user";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
// import Settings from "./pages/Settings";
// import Dashboard from "./pages/Dashboard";
import { LoadingFullScreen } from "./components/Loading";

// lazy load the parts we do not need right away
const AuthenticatedLayout = lazy(
  () => import("./components/AuthenticatedLayout")
);
const UnauthenticatedLayout = lazy(
  () => import("./components/UnauthenticatedLayout")
);
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Stock = lazy(() => import("./pages/Stock"));

/*
TRADE-OFF: Not lazy loading these pages because of the 
           transition effect that is used in the 
           AuthenticatedLayout's Navbar. For non-technical
           users, they will think the split second load is a bug
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Settings = lazy(() => import("./pages/Settings"));
*/

export default function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  // when the app loads, we check if the user has a preferred theme
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [theme]);

  // when the app loads, we check to see if the user is authenticated
  useEffect(() => {
    dispatch(validateUserAuthThunk());
  }, [dispatch]);

  return (
    <Router>
      <Suspense fallback={<LoadingFullScreen fixed={true} />}>
        <Routes>
          {/* Unauthenticated Routes */}
          <Route element={<UnauthenticatedRoute />}>
            <Route element={<UnauthenticatedLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Authenticated Routes */}
          <Route element={<AuthenticatedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/settings" element={<Settings />} /> */}
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/stocks/:symbol" element={<Stock />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
