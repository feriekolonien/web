export function createTournament({
  people,
  type,
  playersPerTeam,
  teamsPerHeat,
  distributionMode,
  teamNameStyle,
}) {
  const children = shuffle(people.filter((person) => person.type === "child"));
  const adults = shuffle(people.filter((person) => person.type === "adult"));
  let teams = [];
  let unused = [];
  const warnings = [];

  if (type === "mixed") {
    ({ teams, unused } = buildMixedTeams(
      children,
      adults,
      playersPerTeam,
      distributionMode,
      teamNameStyle,
      warnings,
    ));
  } else {
    const pool = type === "kids" ? children : adults;
    unused = type === "kids" ? adults : children;
    teams = buildEvenTeams(
      pool,
      playersPerTeam,
      distributionMode,
      teamNameStyle,
    );
    if (pool.length === 0) {
      warnings.push(
        type === "kids"
          ? "Ingen barn funnet i CSV-en."
          : "Ingen voksne funnet i CSV-en.",
      );
    }
  }

  const heats = buildHeats(teams, teamsPerHeat);
  const missingHeatTeams = countMissingHeatTeams(heats);
  if (missingHeatTeams > 0) {
    warnings.push(
      `Antall lag går ikke opp i kampoppsettet, og ${missingHeatTeams} ${
        missingHeatTeams === 1 ? "kamp mangler" : "kamper mangler"
      } lag.`,
    );
  }

  return {
    teams,
    heats,
    unused,
    warnings,
  };
}

function buildEvenTeams(
  players,
  playersPerTeam,
  distributionMode,
  teamNameStyle,
) {
  if (players.length === 0) return [];

  const teamCount = Math.max(1, Math.ceil(players.length / playersPerTeam));
  const teams = createEmptyTeams(teamCount, teamNameStyle);
  assignPlayersToTeams(players, teams, distributionMode);
  return teams;
}

function buildMixedTeams(
  children,
  adults,
  playersPerTeam,
  distributionMode,
  teamNameStyle,
  warnings,
) {
  if (children.length === 0) {
    warnings.push(
      "Ingen barn funnet. Blandet turnering prioriterer barn, så ingen lag ble laget.",
    );
    return { teams: [], unused: adults };
  }

  const kidsPerTeam = Math.max(1, playersPerTeam - 1);
  const teamCount = Math.max(1, Math.ceil(children.length / kidsPerTeam));
  const teams = createEmptyTeams(teamCount, teamNameStyle);

  teams.forEach((team, index) => {
    if (adults[index]) {
      team.lead = adults[index];
      team.players.push(adults[index]);
    }
  });

  assignPlayersToTeams(children, teams, distributionMode);

  const unused = adults.slice(teamCount);
  if (adults.length < teamCount) {
    warnings.push(`${teamCount - adults.length} lag mangler voksen lagleder.`);
  }
  if (unused.length > 0) {
    warnings.push(
      `${unused.length} voksne ble satt på venteliste for å prioritere barna.`,
    );
  }

  return { teams, unused };
}

function assignPlayersToTeams(players, teams, distributionMode) {
  if (distributionMode === "age-balanced") {
    const sortedPlayers = shuffle(players).sort((left, right) => {
      if (left.age !== right.age) return left.age - right.age;
      return left.name.localeCompare(right.name);
    });
    sortedPlayers.forEach((player) => {
      const bestTeam = [...teams].sort((left, right) => {
        const sameAgeDifference = countPlayersWithAge(left, player.age) -
          countPlayersWithAge(right, player.age);
        if (sameAgeDifference !== 0) return sameAgeDifference;

        const sizeDifference = left.players.length - right.players.length;
        if (sizeDifference !== 0) return sizeDifference;

        return getTeamAgeTotal(left) - getTeamAgeTotal(right);
      })[0];
      bestTeam.players.push(player);
    });
    return;
  }

  players.forEach((player, index) => {
    teams[index % teams.length].players.push(player);
  });
}

function countPlayersWithAge(team, age) {
  return team.players.filter((player) => player.age === age).length;
}

function getTeamAgeTotal(team) {
  return team.players.reduce((sum, player) => sum + player.age, 0);
}

function createEmptyTeams(count, teamNameStyle) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: getTeamName(index, teamNameStyle),
    players: [],
    lead: null,
  }));
}

function buildHeats(teams, teamsPerHeat) {
  if (teams.length === 0) return [];
  const heatCount = Math.max(1, Math.ceil(teams.length / teamsPerHeat));
  const heats = Array.from({ length: heatCount }, (_, index) => ({
    name: `Heat ${String.fromCharCode(65 + index)}`,
    teams: [],
  }));

  teams.forEach((team, index) => {
    heats[index % heatCount].teams.push(team);
  });
  return heats;
}

function countMissingHeatTeams(heats) {
  return heats.reduce((sum, heat) => {
    const bracketSlots = nextPowerOfTwo(Math.max(2, heat.teams.length));
    return sum + bracketSlots - heat.teams.length;
  }, 0);
}

function nextPowerOfTwo(number) {
  let power = 1;
  while (power < number) power *= 2;
  return power;
}

function getTeamName(index, style) {
  const colors = [
    "Rød",
    "Blå",
    "Grønn",
    "Gul",
    "Hvit",
    "Svart",
    "Oransje",
    "Lilla",
    "Turkis",
    "Rosa",
  ];
  if (style === "numbers") return `Lag ${index + 1}`;
  if (style === "colors") {
    return colors[index] ? `Lag ${colors[index]}` : `Lag ${index + 1}`;
  }
  return `Lag ${String.fromCharCode(65 + index)}`;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
