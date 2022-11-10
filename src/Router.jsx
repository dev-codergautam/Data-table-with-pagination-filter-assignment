import FilterPage from "./component/FilterPage";
import Homepage from "./component/Homepage";

export const MainRouter = [
  {
    path: "/",
    component: Homepage,
    exact: true,
  },
  {
    path: "/filter/:slug",
    component: FilterPage,
    exact: true,
  },
];
