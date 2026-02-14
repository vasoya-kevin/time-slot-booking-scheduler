import clsx from "clsx";
import React, { FC } from "react";

interface containerProps {
  className?: string;
  children: React.ReactNode;
  fullBleed?: boolean;
}

const Container: FC<containerProps> = ({
  children,
  className,
  fullBleed = false,
}) => {
  return (
    <div
      className={clsx("max-w-7xl w-full px-10 py-20 mx-auto", className, {
        ["max-w-full"]: fullBleed === true,
      })}
    >
      {children}
    </div>
  );
};

export default Container;
