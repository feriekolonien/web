import { parseCsv } from "./csv.js";
import { renderEmpty, renderTournamentOutput } from "./render.js";
import { createTournament } from "./teams.js";

const sampleCsv = `Navn,Alder
Anna,9
Emil,10
Sofia,11
Jonas,12
Maja,10
Oliver,9
Nora,13
Lucas,11
Thea,8
William,12
Leah,10
Henrik,13
Oda,9
Isak,11
Ingrid,12
Mathias,10
Kari,34
Thomas,41
Mina,27
Eirik,22
Lars,48
Silje,31`;

const state = {
  people: [],
  teams: [],
  heats: [],
  unused: [],
  warnings: [],
};

const elements = {
  file: document.getElementById("csv-file"),
  demo: document.getElementById("demo-button"),
  manualCsv: document.getElementById("manual-csv"),
  loadSample: document.getElementById("load-sample-button"),
  peopleSummary: document.getElementById("people-summary"),
  playersPerTeam: document.getElementById("players-per-team"),
  adultAge: document.getElementById("adult-age"),
  teamNameStyle: document.getElementById("team-name-style"),
  teamDistribution: document.getElementById("team-distribution"),
  teamsPerHeat: document.getElementById("teams-per-heat"),
  generate: document.getElementById("generate-button"),
  reshuffle: document.getElementById("reshuffle-button"),
  output: document.getElementById("output"),
  print: document.getElementById("print-button"),
};

elements.file.addEventListener("change", handleFileUpload);
elements.manualCsv.addEventListener("input", () =>
  loadPeople(elements.manualCsv.value)
);
elements.demo.addEventListener("click", () => useDemoData(true));
elements.loadSample.addEventListener("click", () => useDemoData(false));
elements.generate.addEventListener("click", generateTournament);
elements.reshuffle.addEventListener("click", generateTournament);
elements.print.addEventListener("click", () => globalThis.print());
elements.adultAge.addEventListener("change", () => {
  if (elements.manualCsv.value.trim()) loadPeople(elements.manualCsv.value);
});

function handleFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || "");
    elements.manualCsv.value = text;
    loadPeople(text);
  };
  reader.readAsText(file);
}

function useDemoData(shouldGenerate) {
  const mixedOption = document.querySelector(
    'input[name="tournament-type"][value="mixed"]',
  );
  elements.manualCsv.value = sampleCsv;
  loadPeople(sampleCsv);

  if (mixedOption) mixedOption.checked = true;
  if (shouldGenerate) generateTournament();
}

function loadPeople(csvText) {
  const adultAge = getAdultAge();
  state.people = parseCsv(csvText).map((person, index) => ({
    ...person,
    id: `${person.name}-${person.age}-${index}`,
    type: person.age >= adultAge ? "adult" : "child",
  }));
  updateSummary();
}

function generateTournament() {
  if (state.people.length === 0) {
    elements.output.innerHTML = renderEmpty(
      "Ingen deltakere",
      "Last opp eller lim inn en CSV med navn og alder først.",
    );
    return;
  }

  const type = getTournamentType();
  const playersPerTeam = getPlayersPerTeam();
  const result = createTournament({
    people: state.people,
    type,
    playersPerTeam,
    teamsPerHeat: getTeamsPerHeat(),
    distributionMode: getDistributionMode(),
    teamNameStyle: elements.teamNameStyle.value,
  });

  Object.assign(state, result);
  elements.reshuffle.disabled = state.teams.length === 0;
  elements.output.innerHTML = renderTournamentOutput(state, {
    type,
    playersPerTeam,
  });
  bindViewTabs();
}

function bindViewTabs() {
  elements.output.querySelectorAll(".view-tabs button").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
}

function switchView(view) {
  elements.output.querySelectorAll(".view-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  elements.output.querySelectorAll(".view-section").forEach((section) => {
    section.classList.toggle("active", section.dataset.section === view);
  });
}

function updateSummary() {
  const children =
    state.people.filter((person) => person.type === "child").length;
  const adults =
    state.people.filter((person) => person.type === "adult").length;
  elements.peopleSummary.innerHTML = `
    <span>${children} barn</span>
    <span>${adults} voksne</span>
    <span>${state.people.length} totalt</span>
  `;
}

function getTournamentType() {
  return document.querySelector('input[name="tournament-type"]:checked').value;
}

function getPlayersPerTeam() {
  return clampNumber(elements.playersPerTeam.value, 2, 12, 5);
}

function getAdultAge() {
  return clampNumber(elements.adultAge.value, 13, 99, 18);
}

function getTeamsPerHeat() {
  return clampNumber(elements.teamsPerHeat.value, 2, 6, 4);
}

function getDistributionMode() {
  return elements.teamDistribution.value;
}

function clampNumber(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}
