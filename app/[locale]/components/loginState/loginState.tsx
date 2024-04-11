"use client";

import { useAppSelector } from "@/hook/hook";

const LoginState = () => {
  const userId = useAppSelector((state) => state.auth.userId);

  return <>{userId && <div>{userId ? userId.id : ""}</div>}</>;
};

export default LoginState;
