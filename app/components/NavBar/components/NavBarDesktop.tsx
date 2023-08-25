import Links from "./Links";
import Logo from "./Logo";
import User from "./User";

function NavBarDesktop() {
  return (
    <div className="sticky top-0 z-20 mb-4 hidden w-full items-center space-x-6 bg-white p-4 shadow-lg dark:bg-black dark:shadow-gray-900/90 lg:flex lg:p-6">
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
