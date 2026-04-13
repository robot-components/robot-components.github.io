export default function SpecsTable({ specs }) {
  if (!specs || !Array.isArray(specs)) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {specs.map((sec, i) => (
        <div key={i}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #cbd5e1" }}>{sec.section}</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {sec.rows.map((row, j) => (
                <tr key={j} style={{ borderBottom: "0.5px solid #f1f5f9" }}>
                  <td style={{ fontSize: 12, color: "#64748b", padding: "5px 8px", width: "28%", verticalAlign: "top" }}>{row.label}</td>
                  <td style={{ fontSize: 12, color: "#1e293b", padding: "5px 8px", borderLeft: "0.5px solid #e2e8f0", fontWeight: 500 }}>
                    {row.value.split("//").map((p, i, a) => (
                      <span key={i}>{p}{i < a.length - 1 && <br />}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
