import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Iprops {
  allowed: boolean;
  redirectTo: string;
  children: React.ReactNode;
}

function RequireAuth({ allowed, redirectTo, children }: Iprops) {
  const token = useSelector((state: any) => state.authSlice.token);
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  React.useEffect(() => {
    if (allowed !== isLoggedIn) {
      navigate(redirectTo);
    }
  }, [allowed, isLoggedIn, navigate, redirectTo]);
  return allowed === isLoggedIn ? <>{children}</> : null;
}
export default RequireAuth;
