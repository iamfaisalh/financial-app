import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { LoadingFullScreen } from "./Loading";

export default function UnauthenticatedRoute() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.user);

  if (loading) return <LoadingFullScreen fixed={true} />; // Show a loading state while checking auth status
  return isAuthenticated ? <Navigate to="/portfolio" /> : <Outlet />;
}
