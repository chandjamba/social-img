import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "../../constants/index";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks?.map((link) => {
        const isActive = pathname === link?.route;
        return (
          <Link
            to={link?.route}
            className={`flex-center flex-col gap-1 p-2 transition ${
              isActive && "bg-primary-500 rounded-[10px]"
            }`}
            key={link?.label}
          >
            <img
              width={16}
              height={16}
              src={link?.imgURL}
              alt={link?.label}
              className={` ${
                isActive && "invert-white"
              } group-hover:invert-white`}
            />
            <p className="tiny-medium text-light-2">{link?.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
