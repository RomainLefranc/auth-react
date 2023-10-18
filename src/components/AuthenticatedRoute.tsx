import { Outlet, Navigate } from "react-router-dom";
import { useAccountStore } from "../store/store";

export default function AuthenticatedRoute() {
  const { account } = useAccountStore();
  return account ? <Outlet /> : <Navigate to="/login" />;
}
