import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoadingSpinner, LoggedinUser, ModeToggle } from "@/components";
import "../index.css";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { NavLink, useNavigate } from "react-router-dom";
import { AlignRight } from "lucide-react";
import { Button } from "./ui";
import { toast } from "sonner";
import authService from "./appwrite/auth";
import { logout } from "@/features/authSlice";

type navObj = {
  name: string;
  url: string;
  active: boolean;
};

function Header(): React.JSX.Element {
  const { status, userData } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navigations: navObj[] = [
    {
      name: "Login",
      url: "/login",
      active: !status,
    },
    {
      name: "Signup",
      url: "/signup",
      active: !status,
    },
    {
      name: "Dashboard",
      url: userData ? `/@${userData?.name}` : "/",
      active: status,
    },
    {
      name: "Explore",
      url: "/explore",
      active: true,
    },
    {
      name: "Add Project",
      url: "/add-project",
      active: status,
    },
    {
      name: "Feedback",
      url: "/feedback",
      active: true,
    },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      const session = await authService.logout();
      if (session) {
        navigate("/login");
        dispatch(logout());
      }
    } catch (error) {
      console.log("Error on user log out", error);
      toast.error("Something went wrong can't logout");
    } finally {
      setLoading(false);
    }
  };
  console.log(status);

  return (
    <header
      className="flex items-center justify-between px-3 py-2  border-b-2 border-x-0 border-t-0 "
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="font-['Great_Vibes'] space-x-1 text-2xl lg:text-3xl md:text-2xl select-none cursor-pointer font-semibold">
        Projecthunt
      </div>
      <nav className="hidden md:flex justify-between items-center gap-8">
        {navigations
          .filter((element) => element.active)
          .map((navItem, index) => (
            <NavLink
              key={index}
              to={navItem.url}
              className={({ isActive }) =>
                `${
                  isActive ? "text-primary" : "text-muted-foreground"
                } hover:text-primary duration-300 transition-all`
              }
            >
              <li className="list-none font-semibold text-lg">
                {navItem.name}
              </li>
            </NavLink>
          ))}
        <div className="flex items-center justify-center gap-2">
          {status && (
            <>
              <LoggedinUser />
              <Button
                onClick={handleLogout}
                className="cursor-pointer"
                variant={"outline"}
                disabled={loading}
              >
                Logout {loading && <LoadingSpinner />}
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </nav>

      <div className="flex md:hidden items-center">
        <Sheet>
          {status && (
            <div className="px-1">
              <LoggedinUser />
            </div>
          )}
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <AlignRight
                style={{ width: "1.5rem", height: "1.5rem" }}
                strokeWidth={2.5}
              />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[90%] px-3 backdrop-blur-lg bg-background/60"
          >
            <div className="px-2 py-3">
              <ModeToggle />
            </div>
            <SheetHeader className="py-0 px-3">
              <SheetTitle className="text-md text-muted-foreground font-semibold">
                Menu
              </SheetTitle>
            </SheetHeader>

            <ul className="px-3 space-y-4">
              {navigations
                .filter((item) => item.active)
                .map((navItem, index) => (
                  <NavLink
                    key={index}
                    to={navItem.url}
                    className={({ isActive }) =>
                      `${
                        isActive ? "text-primary" : "text-secondary-foreground"
                      }`
                    }
                  >
                    <li className="list-none font-semibold py-2 text-2xl">
                      {navItem.name}
                    </li>
                  </NavLink>
                ))}
              {status && (
                <Button
                  onClick={handleLogout}
                  className="cursor-pointer my-2"
                  variant={"outline"}
                  disabled={loading}
                >
                  Logout {loading && <LoadingSpinner />}
                </Button>
              )}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
