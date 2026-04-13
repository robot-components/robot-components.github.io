import { useState, useEffect } from "react";

export default function PageWrapper({ children, pageKey }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setVis(false);
    const t = setTimeout(() => setVis(true), 40);
    return () => clearTimeout(t);
  }, [pageKey]);
  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.22s,transform 0.22s" }}>
      {children}
    </div>
  );
}
