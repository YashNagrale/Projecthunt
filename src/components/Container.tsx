import React from "react";

type ChildrenProp = {
  children: React.ReactNode;
  className?: string;
};
function Container({ children, className }: ChildrenProp) {
  return <div className={`w-full mx-auto p-2 ${className}`}>{children}</div>;
}

export default Container;
