import React from "react";

interface IContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: IContainerProps) => {
  return <div className={`w-full mx-auto ${className}`}>{children}</div>;
};

export default Container;
