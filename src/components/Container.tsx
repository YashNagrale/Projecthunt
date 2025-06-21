import React from "react";

type ChildrenProp = {
  children: React.ReactNode;
};
function Container({ children }: ChildrenProp) {
  return <div className="w-full mx-auto p-2">{children}</div>;
}

export default Container;
