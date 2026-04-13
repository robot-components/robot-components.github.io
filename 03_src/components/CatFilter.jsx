export default function CatFilter({ cats, active, setActive }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
      {["전체", ...cats].map((c) => (
        <button
          key={c}
          onClick={() => setActive(c)}
          style={{ background: active === c ? "#1e3a5f" : "#fff", color: active === c ? "#fff" : "#475569", border: "0.5px solid #cbd5e1", padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
