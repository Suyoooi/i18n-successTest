import { useEffect, useState } from "react";

const useWindowHeight = (): number | 0 => {
  const [windowHeight, setWindowHeight] = useState<number | 0>(0);

  useEffect(() => {
    const handleResize = (): void => {
      setWindowHeight(window.innerHeight);
    };

    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return windowHeight;
};

export default useWindowHeight;
