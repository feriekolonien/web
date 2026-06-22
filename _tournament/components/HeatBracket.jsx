export default function HeatBracket({ heats }) {
  return (
    <section class="print-block">
      <div class="section-heading">
        <h2>Heats</h2>
      </div>
      <div class="heat-bracket-grid">
        {heats.map((heat) => (
          <article class="heat-bracket-card" key={heat.name}>
            <div class="heat-bracket-heading">
              <h3>{heat.name}</h3>
              <div class="heat-winner-slot">Vinner:</div>
            </div>
            <Bracket
              rounds={buildBracketRounds(
                padBracketSlots(heat.teams.map((team) => team.name)),
              )}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function Bracket({ rounds }) {
  return (
    <div class="visual-bracket visual-bracket-heat">
      {rounds.map((round, roundIndex) => (
        <div class="visual-bracket-round" key={roundIndex}>
          <h3>{getRoundName(rounds.length, roundIndex)}</h3>
          <div class="visual-bracket-matches">
            {round.map((match) => (
              <div class="visual-match" key={match.label}>
                <span class="visual-match-label">{match.label}</span>
                <BracketBox value={match.teams[0]} />
                <span class="visual-vs">VS</span>
                <BracketBox value={match.teams[1]} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BracketBox({ value }) {
  const isPlaceholder = String(value || "").startsWith("Vinner:");
  return (
    <div
      class={`visual-team-box ${isPlaceholder ? "visual-placeholder-box" : ""}`}
    >
      {value || ""}
    </div>
  );
}

function padBracketSlots(slots) {
  const paddedSlots = [...slots];
  const bracketSlots = nextPowerOfTwo(Math.max(2, paddedSlots.length));
  while (paddedSlots.length < bracketSlots) paddedSlots.push("Ledig");
  return paddedSlots;
}

function buildBracketRounds(initialSlots) {
  const rounds = [];
  let current = initialSlots;

  while (current.length >= 2) {
    const matches = [];
    for (let index = 0; index < current.length; index += 2) {
      matches.push({
        label: `Kamp ${index / 2 + 1}`,
        teams: [current[index], current[index + 1]],
      });
    }
    rounds.push(matches);
    if (matches.length === 1) break;
    current = matches.map(() => "Vinner: ");
  }

  return rounds;
}

function getRoundName(totalRounds, index) {
  if (index === totalRounds - 1) return "Finale";
  if (index === totalRounds - 2) return "Semifinaler";
  if (index === totalRounds - 3) return "Kvartfinaler";
  return `Runde ${index + 1}`;
}

function nextPowerOfTwo(number) {
  let power = 1;
  while (power < number) power *= 2;
  return power;
}
