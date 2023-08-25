import Links from "./Links";
import Logo from "./Logo";
import User from "./User";

function NavBarDesktop() {
  return (
    <div className="hidden sticky top-0 z-20 w-full items-center space-x-6 bg-white p-4 dark:bg-black lg:flex lg:p-6 shadow-lg dark:shadow-purple-900/60 mb-4">
      <Logo />
      <div className="flex w-full items-center justify-between space-x-4">
        <div className="flex h-auto space-x-4 lg:space-x-8">
          <Links />
        </div>
        <User />
      </div>
    </div>
  );
}

export default NavBarDesktop;
