import { useEffect, useMemo, useState } from "preact/hooks";

export default function HeatBracket({ heats }) {
  const [winners, setWinners] = useState({});
  const heatsSignature = useMemo(
    () =>
      heats.map((heat) =>
        `${heat.name}:${heat.teams.map((team) => team.name).join(",")}`
      ).join("|"),
    [heats],
  );

  useEffect(() => {
    setWinners({});
  }, [heatsSignature]);

  function updateWinner(matchKey, winner) {
    setWinners((current) => ({ ...current, [matchKey]: winner }));
  }

  return (
    <section class="print-block">
      <div class="section-heading">
        <h2>Heats</h2>
      </div>
      <div class="heat-bracket-grid">
        {heats.map((heat) => {
          const rounds = buildBracketRounds(
            padBracketSlots(heat.teams.map((team) => team.name)),
            winners,
            heat.name,
          );

          return (
            <article class="heat-bracket-card" key={heat.name}>
              <div class="heat-bracket-heading">
                <h3>{heat.name}</h3>
                <HeatWinnerSelect
                  heatName={heat.name}
                  onWinnerChange={updateWinner}
                  slot={getHeatWinnerSlot(rounds, winners)}
                />
              </div>
              <Bracket onWinnerChange={updateWinner} rounds={rounds} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HeatWinnerSelect({ heatName, onWinnerChange, slot }) {
  if (slot.type === "team") {
    return (
      <>
        <div class="heat-winner-slot heat-winner-value print-hidden">
          {slot.value}
        </div>
        <div class="heat-winner-slot print-only">Vinner:</div>
      </>
    );
  }

  return (
    <>
      <select
        aria-label={`Vinner ${heatName}`}
        class="heat-winner-select print-hidden"
        disabled={slot.disabled}
        value={slot.value}
        onChange={(event) =>
          onWinnerChange(slot.key, event.currentTarget.value)}
      >
        <option value="">Vinner:</option>
        {slot.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div class="heat-winner-slot print-only">Vinner:</div>
    </>
  );
}

function Bracket({ rounds, onWinnerChange }) {
  return (
    <div class="visual-bracket visual-bracket-heat">
      {rounds.map((round, roundIndex) => (
        <div class="visual-bracket-round" key={roundIndex}>
          <h3>{getRoundName(rounds.length, roundIndex)}</h3>
          <div class="visual-bracket-matches">
            {round.map((match) => (
              <div class="visual-match" key={match.key}>
                <span class="visual-match-label">{match.label}</span>
                <BracketSlot
                  match={match}
                  slot={match.slots[0]}
                  onWinnerChange={onWinnerChange}
                />
                <span class="visual-vs">VS</span>
                <BracketSlot
                  match={match}
                  slot={match.slots[1]}
                  onWinnerChange={onWinnerChange}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BracketSlot({ match, slot, onWinnerChange }) {
  if (slot.type === "winner") {
    return (
      <>
        <select
          aria-label={`${match.label} ${slot.label}`}
          class="visual-winner-select print-hidden"
          disabled={slot.disabled}
          value={slot.value}
          onChange={(event) =>
            onWinnerChange(slot.key, event.currentTarget.value)}
        >
          <option value="">Vinner:</option>
          {slot.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div class="visual-team-box visual-placeholder-box print-only">
          Vinner:
        </div>
      </>
    );
  }

  return <BracketBox value={slot.value} />;
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
  const paddedSlots = slots.map((slot) => createTeamSlot(slot));
  const bracketSlots = nextPowerOfTwo(Math.max(2, paddedSlots.length));
  while (paddedSlots.length < bracketSlots) {
    paddedSlots.push(createTeamSlot("Ledig"));
  }
  return paddedSlots;
}

function buildBracketRounds(initialSlots, winners, heatName) {
  const rounds = [];
  let current = initialSlots;
  let matchNumber = 1;

  while (current.length >= 2) {
    const roundIndex = rounds.length;
    const matches = [];
    for (let index = 0; index < current.length; index += 2) {
      const matchIndex = index / 2;
      matches.push({
        key: `${heatName}-${roundIndex}-${matchIndex}`,
        label: `Kamp ${matchNumber}`,
        slots: [current[index], current[index + 1]],
      });
      matchNumber += 1;
    }
    rounds.push(matches);
    if (matches.length === 1) break;
    current = matches.map((match) => createWinnerSlot(match, winners));
  }

  return rounds;
}

function createTeamSlot(value) {
  return {
    type: "team",
    value,
  };
}

function createWinnerSlot(match, winners) {
  const options = getSelectableTeams(match.slots);
  const hasPendingSlots = match.slots.some(isPendingSlot);
  const savedWinner = winners[match.key] || "";
  const value = options.includes(savedWinner) ? savedWinner : "";

  if (!hasPendingSlots && options.length === 1) {
    return createTeamSlot(options[0]);
  }

  return {
    type: "winner",
    key: match.key,
    label: "Vinner:",
    options,
    value,
    disabled: options.length < 2,
  };
}

function getSelectableTeams(slots) {
  return slots.flatMap((slot) => {
    if (slot.type === "team" && slot.value !== "Ledig") return [slot.value];
    if (slot.type === "winner" && slot.value) return [slot.value];
    return [];
  });
}

function isPendingSlot(slot) {
  return slot.type === "winner" && !slot.value;
}

function getHeatWinnerSlot(rounds, winners) {
  const finalMatch = rounds.at(-1)?.[0];
  if (!finalMatch) return createTeamSlot("");

  const options = getSelectableTeams(finalMatch.slots);
  const hasPendingSlots = finalMatch.slots.some(isPendingSlot);
  const savedWinner = winners[finalMatch.key] || "";
  const value = options.includes(savedWinner) ? savedWinner : "";

  if (!hasPendingSlots && options.length === 1) {
    return createTeamSlot(options[0]);
  }

  return {
    type: "winner",
    key: finalMatch.key,
    label: "Vinner:",
    options,
    value,
    disabled: options.length < 2,
  };
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
