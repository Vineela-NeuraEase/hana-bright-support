
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div className={`container max-w-6xl px-4 mx-auto ${className}`}>
      {children}
    </div>
  );
};
