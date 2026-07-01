import { useState, useEffect } from "react";

export default function useIsSmall(breakpoint = 1100) {
  const [isSmall, setIsSmall] = useState(() => window.innerWidth > 700 && window.innerWidth <= breakpoint);
  useEffect(() => {
    const h = () => setIsSmall(window.innerWidth > 700 && window.innerWidth <= breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return isSmall;
}
