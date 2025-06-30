import React from "react";
import { FeedbackFormAlert, ModeToggle } from "@/components";
import "../index.css";

function Header(): React.JSX.Element {
  return (
    <header
      className="flex items-center justify-between px-3 py-2  border-b-2 border-x-0 border-t-0 "
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="font-['Great_Vibes'] space-x-1 text-2xl lg:text-3xl md:text-2xl select-none cursor-pointer font-semibold">
        Projecthunt
      </div>
      <div className="flex items-center justify-center gap-2">
        <FeedbackFormAlert />
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
