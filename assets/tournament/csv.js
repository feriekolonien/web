export function parseCsv(text) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => splitCsvLine(line).map((cell) => cell.trim()))
    .filter((row) => row.some(Boolean));

  if (rows.length === 0) return [];

  const firstRow = rows[0].map((cell) => cell.toLowerCase());
  const hasHeader =
    firstRow.some((cell) =>
      ["navn", "name", "first name", "fornavn"].includes(cell)
    ) ||
    firstRow.some((cell) => ["alder", "age"].includes(cell));

  const header = hasHeader ? firstRow : [];
  const nameIndex = header.findIndex((cell) =>
    ["navn", "name", "first name", "fornavn"].includes(cell)
  );
  const ageIndex = header.findIndex((cell) => ["alder", "age"].includes(cell));
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows.map((row) => {
    const name = row[nameIndex >= 0 ? nameIndex : 0] || "";
    const age = Number.parseInt(row[ageIndex >= 0 ? ageIndex : 1], 10);
    return { name, age };
  }).filter((person) => person.name && Number.isFinite(person.age));
}

function splitCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}
