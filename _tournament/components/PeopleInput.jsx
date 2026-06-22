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
      <div class="tournament-panel-heading">
        <span class="tournament-step">1</span>
        <div>
          <h2>Deltakere</h2>
          <p>CSV med navn og alder. Alt blir behandlet lokalt i nettleseren.</p>
        </div>
      </div>
      <label class="upload-box" for="csv-file">
        <span class="upload-badge">CSV</span>
        <span class="upload-copy">
          <span class="upload-title">Velg CSV-fil</span>
          <span class="upload-help">
            Kolonner: fornavn og alder. Overskrift er valgfritt.
          </span>
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
        <span>
          <strong>{summary.children}</strong>
          <small>Barn</small>
        </span>
        <span>
          <strong>{summary.adults}</strong>
          <small>Voksne</small>
        </span>
        <span>
          <strong>{summary.total}</strong>
          <small>Totalt</small>
        </span>
      </div>
    </section>
  );
}
