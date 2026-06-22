import { useMemo, useState } from "preact/hooks";
import { sampleCsv } from "../data/sampleCsv.js";
import { parseCsv } from "../lib/csv.js";
import { createTournament } from "../lib/teams.js";
import PeopleInput from "./PeopleInput.jsx";
import SettingsForm from "./SettingsForm.jsx";
import TournamentOutput from "./TournamentOutput.jsx";

const defaultSettings = {
  type: "kids",
  playersPerTeam: 5,
  adultAge: 18,
  teamNameStyle: "letters",
  distributionMode: "random",
  teamsPerHeat: 4,
};

export default function TournamentApp() {
  const [manualCsv, setManualCsv] = useState("");
  const [people, setPeople] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [tournament, setTournament] = useState(null);
  const [activeView, setActiveView] = useState("teams");

  const summary = useMemo(() => {
    const children = people.filter((person) => person.type === "child").length;
    const adults = people.filter((person) => person.type === "adult").length;
    return { children, adults, total: people.length };
  }, [people]);

  function loadPeople(csvText, adultAge = settings.adultAge) {
    const nextPeople = normalizePeople(parseCsv(csvText), adultAge);
    setPeople(nextPeople);
    return nextPeople;
  }

  function updateSettings(patch) {
    const nextSettings = { ...settings, ...patch };
    setSettings(nextSettings);

    if (Object.hasOwn(patch, "adultAge") && manualCsv.trim()) {
      loadPeople(manualCsv, nextSettings.adultAge);
    }
  }

  function useDemoData(shouldGenerate) {
    const nextSettings = { ...settings, type: "mixed" };
    const nextPeople = normalizePeople(
      parseCsv(sampleCsv),
      nextSettings.adultAge,
    );

    setManualCsv(sampleCsv);
    setSettings(nextSettings);
    setPeople(nextPeople);

    if (shouldGenerate) {
      setTournament(buildTournament(nextPeople, nextSettings));
      setActiveView("teams");
    }
  }

  function handleManualCsvChange(value) {
    setManualCsv(value);
    loadPeople(value);
  }

  function handleFileText(text) {
    setManualCsv(text);
    loadPeople(text);
  }

  function generateTournament() {
    if (people.length === 0) {
      setTournament({
        teams: [],
        heats: [],
        unused: [],
        warnings: ["Last opp eller lim inn en CSV med navn og alder først."],
        emptyTitle: "Ingen deltakere",
      });
      return;
    }

    setTournament(buildTournament(people, settings));
    setActiveView("teams");
  }

  return (
    <>
      <div class="tournament-header">
        <div>
          <p class="tournament-kicker">Turneringsverktøy</p>
          <h1>Lagoppsett og kampplan</h1>
          <p class="tournament-lead">
            Last opp en CSV med fornavn og alder, velg turneringstype, og skriv
            ut lag, heats og finaler. Alt skjer lokalt i nettleseren.
          </p>
        </div>
        <div class="tournament-header-actions print-hidden">
          <button
            class="tournament-button tournament-button-quiet tournament-button-small"
            type="button"
            onClick={() => useDemoData(true)}
          >
            Demo
          </button>
          <button
            class="tournament-button tournament-button-secondary"
            type="button"
            onClick={() => globalThis.print()}
          >
            <span aria-hidden="true">⎙</span>
            Skriv ut
          </button>
        </div>
      </div>

      <div class="tournament-grid print-hidden">
        <PeopleInput
          manualCsv={manualCsv}
          summary={summary}
          onFileText={handleFileText}
          onManualCsvChange={handleManualCsvChange}
          onUseExample={() => useDemoData(false)}
        />
        <SettingsForm
          hasGeneratedTeams={Boolean(tournament?.teams?.length)}
          settings={settings}
          onGenerate={generateTournament}
          onReshuffle={generateTournament}
          onSettingsChange={updateSettings}
        />
      </div>

      <TournamentOutput
        activeView={activeView}
        settings={settings}
        tournament={tournament}
        onViewChange={setActiveView}
      />
    </>
  );
}

function buildTournament(people, settings) {
  return createTournament({
    people,
    type: settings.type,
    playersPerTeam: settings.playersPerTeam,
    teamsPerHeat: settings.teamsPerHeat,
    distributionMode: settings.distributionMode,
    teamNameStyle: settings.teamNameStyle,
  });
}

function normalizePeople(parsedPeople, adultAge) {
  return parsedPeople.map((person, index) => ({
    ...person,
    id: `${person.name}-${person.age}-${index}`,
    type: person.age >= adultAge ? "adult" : "child",
  }));
}
