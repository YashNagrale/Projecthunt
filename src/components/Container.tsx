import React from "react";

type ChildrenProp = {
  children: React.ReactNode;
  className?: string;
};
function Container({ children, className }: ChildrenProp) {
  return <div className={`w-full ${className}`}>{children}</div>;
}

export default Container;
