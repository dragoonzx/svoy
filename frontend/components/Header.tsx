import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { buttonVariants } from "@/components/ui/button";

const LANDING_PATHNAME = "/";

export function Header() {
  const location = useLocation();
  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
      <h1 className="display">
        <Link to="/">Svoy</Link>
      </h1>

      <div className="flex gap-2 items-center flex-wrap">
        {location.pathname === LANDING_PATHNAME ? (
          <Link className={buttonVariants({ variant: "default" })} to={"/app"}>
            Launch app
          </Link>
        ) : (
          <WalletSelector />
        )}
      </div>
    </div>
  );
}
