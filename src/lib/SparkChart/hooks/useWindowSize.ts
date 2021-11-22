import * as  React from "react";

export const useWindowSize = <T>(ref: React.RefObject<T>) => {
  const [size, setSize] = React.useState([0, 0]);

  React.useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", updateSize);

    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};
