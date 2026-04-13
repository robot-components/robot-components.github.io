// "섹션명:\n항목 | 값" 형식 텍스트를 specs 배열로 파싱
export function parseSpecs(text) {
  if (!text) return [];
  const sections = [];
  let cur = null;
  text.split("\n").forEach((line) => {
    const t = line.trim();
    if (!t) return;
    if (t.endsWith(":")) {
      cur = { section: t.slice(0, -1).trim(), rows: [] };
      sections.push(cur);
    } else if (cur && t.includes("|")) {
      const idx = t.indexOf("|");
      cur.rows.push({ label: t.slice(0, idx).trim(), value: t.slice(idx + 1).trim() });
    }
  });
  return sections;
}

// specs 배열을 편집용 텍스트로 변환
export function specsToText(specs) {
  if (!specs || !Array.isArray(specs)) return "";
  return specs
    .map((s) => `${s.section}:\n${s.rows.map((r) => `${r.label} | ${r.value}`).join("\n")}`)
    .join("\n\n");
}
