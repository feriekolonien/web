import HeatBracket from "./HeatBracket.jsx";
import TeamTable from "./TeamTable.jsx";

const modeText = {
  kids: "Barneturnering",
  adults: "Voksenturnering",
  mixed: "Blandet turnering",
};

export default function TournamentOutput({
  activeView,
  settings,
  tournament,
  onViewChange,
}) {
  if (!tournament) {
    return (
      <section class="tournament-output" aria-live="polite">
        <EmptyState
          title="Klar for lagoppsett"
          text="Last opp eller lim inn CSV-data, juster innstillingene, og trykk Generer."
        />
      </section>
    );
  }

  if (tournament.teams.length === 0) {
    return (
      <section class="tournament-output" aria-live="polite">
        <EmptyState
          title={tournament.emptyTitle || "Ingen lag laget"}
          text={tournament.warnings[0] || "Endre innstillingene og prøv igjen."}
        />
      </section>
    );
  }

  const teamCount = tournament.teams.length;
  const peopleInTeams = tournament.teams.reduce(
    (sum, team) => sum + team.players.length,
    0,
  );
  const title = modeText[settings.type];

  return (
    <section class="tournament-output" aria-live="polite">
      <div class="print-title">
        <p>Filtvet Feriekoloni</p>
        <h1>{title}</h1>
      </div>
      <div class="output-toolbar print-hidden">
        <div>
          <h2>{title}</h2>
          <p>
            {teamCount} lag, {peopleInTeams} spillere i lag,{" "}
            {settings.playersPerTeam} spillere per lag.
          </p>
        </div>
        <div class="view-tabs" role="tablist" aria-label="Visning">
          <button
            class={activeView === "teams" ? "active" : ""}
            type="button"
            onClick={() => onViewChange("teams")}
          >
            Lag
          </button>
          <button
            class={activeView === "heats" ? "active" : ""}
            type="button"
            onClick={() => onViewChange("heats")}
          >
            Heats
          </button>
        </div>
      </div>

      <WarningList warnings={tournament.warnings} />
      <div
        class={`view-section ${activeView === "teams" ? "active" : ""}`}
        data-section="teams"
      >
        <TeamTable teams={tournament.teams} />
      </div>
      <div
        class={`view-section ${activeView === "heats" ? "active" : ""}`}
        data-section="heats"
      >
        <HeatBracket heats={tournament.heats} />
      </div>
      <UnusedList unused={tournament.unused} />
    </section>
  );
}

function EmptyState({ title, text }) {
  return (
    <div class="empty-state">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function WarningList({ warnings }) {
  if (!warnings.length) return null;

  return (
    <div class="warning-list">
      {warnings.map((warning) => <p key={warning}>{warning}</p>)}
    </div>
  );
}

function UnusedList({ unused }) {
  if (!unused.length) return null;

  return (
    <section class="unused-list">
      <h2>Venteliste / ikke brukt</h2>
      <p>
        {unused.map((person) => `${person.name} (${person.age})`).join(", ")}
      </p>
    </section>
  );
}
