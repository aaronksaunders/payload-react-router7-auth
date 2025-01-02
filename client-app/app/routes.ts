import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { redirect } from "react-router";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
] satisfies RouteConfig;
