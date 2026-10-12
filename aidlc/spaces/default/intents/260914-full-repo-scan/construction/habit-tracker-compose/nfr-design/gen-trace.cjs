const fs = require("fs");
const ids = [
  "NFR2.1","NFR2.2","NFR2.3",
  "NFR3.1","NFR3.2","NFR3.3","NFR3.4","NFR3.5","NFR3.6","NFR3.7","NFR3.8","NFR3.9","NFR3.10","NFR3.11","NFR3.12","NFR3.13","NFR3.14","NFR3.15","NFR3.16","NFR3.17","NFR3.18","NFR3.19","NFR3.20",
  "NFR7.1","NFR7.2","NFR7.3","NFR7.4","NFR7.5","NFR7.6","NFR7.7","NFR7.8","NFR7.9","NFR7.10","NFR7.11","NFR7.12","NFR7.13","NFR7.14","NFR7.15","NFR7.16","NFR7.17","NFR7.18","NFR7.19","NFR7.20",
];
const gap = new Set(["NFR3.9","NFR3.16","NFR3.18","NFR3.19","NFR3.20"]);
const na = new Set(["NFR3.17","NFR7.18","NFR7.19","NFR7.20"]);
const labels = {
  "NFR3.9": "BL-OPS-01 (security-design.md)",
  "NFR3.16": "BL-OPS-03 (security-design.md)",
  "NFR3.18": "BL-OPS-01 (security-design.md)",
  "NFR3.19": "BL-OPS-02 (security-design.md)",
  "NFR3.20": "BL-OPS-04 (security-design.md)",
  "NFR2.1": "Planning boundary section (security-design.md)",
};
const coverage = ids.map((id) => {
  let status = "OK";
  if (na.has(id)) status = "N/A";
  else if (gap.has(id)) status = "GAP";
  const target = labels[id] ?? (id.startsWith("NFR7.") ? "As-built in security-design.md + tech-stack-decisions.md" : "As-built pattern in security-design.md");
  return { id, status, target };
});
fs.writeFileSync(
  "traceability.json",
  JSON.stringify(
    {
      stage: "nfr-design",
      unit: "habit-tracker-compose",
      upstream_ids: ids,
      coverage,
    },
    null,
    2,
  ) + "\n",
);
