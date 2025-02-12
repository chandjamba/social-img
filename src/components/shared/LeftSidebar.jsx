/* eslint-disable react-hooks/exhaustive-deps */
import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutation";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignoutAccount();
  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo.svg" width={170} height={36} />
        </Link>
        <Link to={`/profile/${user?.id}`} className="flex items-center gap-3">
          <img
            className="h-14 w-14 rounded-full"
            src={user?.imageUrl || "/assets/images/profile-placeholder.svg"}
          />
          <div className="flex flex-col">
            <p className="body-bold">{user?.name}</p>
            <p className="small-regular text-light-3">@{user?.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks?.map((link) => {
            const isActive = pathname === link?.route;
            return (
              <li
                className={`left-sidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
                key={link?.label}
              >
                <NavLink
                  to={link?.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link?.imgURL}
                    alt={link?.label}
                    className={` ${
                      isActive && "invert-white"
                    } group-hover:invert-white`}
                  />
                  {link?.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        onClick={() => signOut()}
        variant="ghost"
        className="shad-button_ghost"
      >
        <img src="/assets/icons/logout.svg" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
