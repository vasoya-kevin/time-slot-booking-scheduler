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
      className={clsx(" w-full px-10 py-20 mx-auto", className, {
        ["max-w-full!"]: fullBleed === true,
        ["max-w-7xl"]: fullBleed === false,
      })}
    >
      {children}
    </div>
  );
};

export default Container;
