import { useAppDispatch, useAppSelector } from "../redux/store";
import { toggleTheme } from "../redux/reducers/theme";
import { NavbarItem } from "./Navbar";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);

  return (
    <NavbarItem onClick={() => dispatch(toggleTheme())}>
      {theme.mode === "dark" ? <MoonIcon /> : <SunIcon />}
    </NavbarItem>
  );
}
