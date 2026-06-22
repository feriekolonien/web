export default function SettingsForm({
  hasGeneratedTeams,
  settings,
  onGenerate,
  onReshuffle,
  onSettingsChange,
}) {
  return (
    <section class="tournament-panel">
      <div class="tournament-panel-heading">
        <span class="tournament-step">2</span>
        <div>
          <h2>Oppsett</h2>
          <p>
            Velg hvem som spiller, hvordan lagene fordeles, og hvor store
            heatene skal være.
          </p>
        </div>
      </div>
      <div class="control-stack">
        <fieldset>
          <legend>Turneringstype</legend>
          <div
            class="segmented-control"
            role="radiogroup"
            aria-label="Turneringstype"
          >
            <TournamentTypeOption
              checked={settings.type === "kids"}
              label="Barn"
              value="kids"
              onChange={(type) => onSettingsChange({ type })}
            />
            <TournamentTypeOption
              checked={settings.type === "adults"}
              label="Voksne"
              value="adults"
              onChange={(type) => onSettingsChange({ type })}
            />
            <TournamentTypeOption
              checked={settings.type === "mixed"}
              label="Blandet"
              value="mixed"
              onChange={(type) => onSettingsChange({ type })}
            />
          </div>
        </fieldset>

        <label>
          Spillere per lag
          <input
            type="number"
            min="2"
            max="12"
            value={settings.playersPerTeam}
            onInput={(event) =>
              onSettingsChange({
                playersPerTeam: clampNumber(
                  event.currentTarget.value,
                  2,
                  12,
                  5,
                ),
              })}
          />
        </label>

        <label>
          Voksen fra alder
          <input
            type="number"
            min="13"
            max="99"
            value={settings.adultAge}
            onInput={(event) =>
              onSettingsChange({
                adultAge: clampNumber(event.currentTarget.value, 13, 99, 18),
              })}
          />
        </label>

        <label>
          Lagnavn
          <select
            value={settings.teamNameStyle}
            onChange={(event) =>
              onSettingsChange({ teamNameStyle: event.currentTarget.value })}
          >
            <option value="letters">Lag A, B, C</option>
            <option value="numbers">Lag 1, 2, 3</option>
            <option value="colors">Farger</option>
          </select>
        </label>

        <label>
          Lagfordeling
          <select
            value={settings.distributionMode}
            onChange={(event) =>
              onSettingsChange({ distributionMode: event.currentTarget.value })}
          >
            <option value="random">Tilfeldig</option>
            <option value="age-balanced">Aldersbalansert</option>
          </select>
        </label>

        <label>
          Maks lag per heat
          <input
            type="number"
            min="2"
            max="6"
            value={settings.teamsPerHeat}
            onInput={(event) =>
              onSettingsChange({
                teamsPerHeat: clampNumber(event.currentTarget.value, 2, 6, 4),
              })}
          />
        </label>
      </div>
      <div class="button-row">
        <button class="tournament-button" type="button" onClick={onGenerate}>
          Generer
        </button>
        <button
          class="tournament-button tournament-button-secondary"
          type="button"
          disabled={!hasGeneratedTeams}
          onClick={onReshuffle}
        >
          Stokk på nytt
        </button>
      </div>
      <p class="tournament-note">
        Blandet turnering lager lag med barn først og bruker maks én voksen som
        lagleder per lag.
      </p>
    </section>
  );
}

function TournamentTypeOption({ checked, label, value, onChange }) {
  return (
    <label>
      <input
        type="radio"
        name="tournament-type"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span>{label}</span>
    </label>
  );
}

function clampNumber(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}
