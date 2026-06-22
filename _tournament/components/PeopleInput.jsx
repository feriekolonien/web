const csvPlaceholder = `Navn,Alder
Anna,11
Marius,35`;

export default function PeopleInput({
  manualCsv,
  summary,
  onFileText,
  onManualCsvChange,
  onUseExample,
}) {
  function handleFileUpload(event) {
    const file = event.currentTarget.files && event.currentTarget.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onFileText(String(reader.result || ""));
    reader.readAsText(file);
  }

  return (
    <section class="tournament-panel">
      <h2>1. Deltakere</h2>
      <label class="upload-box" for="csv-file">
        <span class="upload-title">Velg CSV-fil</span>
        <span class="upload-help">
          Kolonner: fornavn og alder. Overskrift er valgfritt.
        </span>
        <input
          id="csv-file"
          type="file"
          accept=".csv, text/csv"
          onChange={handleFileUpload}
        />
      </label>
      <div class="manual-entry">
        <label for="manual-csv">Eller lim inn CSV</label>
        <div class="textarea-action-wrap">
          <textarea
            id="manual-csv"
            rows="6"
            placeholder={csvPlaceholder}
            value={manualCsv}
            onInput={(event) => onManualCsvChange(event.currentTarget.value)}
          />
          <button
            class="textarea-action-link"
            type="button"
            onClick={onUseExample}
          >
            Eksempeldata
          </button>
        </div>
      </div>
      <div class="summary-row">
        <span>{summary.children} barn</span>
        <span>{summary.adults} voksne</span>
        <span>{summary.total} totalt</span>
      </div>
    </section>
  );
}
