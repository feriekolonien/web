export function renderTournamentOutput(state, { type, playersPerTeam }) {
  if (state.teams.length === 0) {
    return renderEmpty(
      'Ingen lag laget',
      state.warnings[0] || 'Endre innstillingene og prøv igjen.',
    );
  }

  const teamCount = state.teams.length;
  const peopleInTeams = state.teams.reduce(
    (sum, team) => sum + team.players.length,
    0,
  );
  const modeText = {
    kids: 'Barneturnering',
    adults: 'Voksenturnering',
    mixed: 'Blandet turnering',
  }[type];

  return `
    <div class="print-title">
      <p>Filtvet Feriekoloni</p>
      <h1>${escapeHtml(modeText)}</h1>
    </div>
    <div class="output-toolbar print-hidden">
      <div>
        <h2>${escapeHtml(modeText)}</h2>
        <p>${teamCount} lag, ${peopleInTeams} spillere i lag, ${playersPerTeam} spillere per lag.</p>
      </div>
      <div class="view-tabs" role="tablist" aria-label="Visning">
        <button class="active" data-view="teams" type="button">Lag</button>
        <button data-view="heats" type="button">Heats</button>
      </div>
    </div>
    ${renderWarnings(state.warnings)}
    <div class="view-section active" data-section="teams">${renderTeamsTable(state.teams)}</div>
    <div class="view-section" data-section="heats">${renderHeats(state.heats)}</div>
    ${renderUnused(state.unused)}
  `;
}

export function renderEmpty(title, text) {
  return `
    <div class="empty-state">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function renderTeamsTable(teams) {
  return `
    <section class="print-block">
      <div class="section-heading">
        <h2>Lagliste</h2>
        <span>Fyll inn lagnavn eller draktfarge før kampstart.</span>
      </div>
      <div class="team-table-wrap">
        <table class="team-table">
          <thead>
            <tr>
              <th>Lag</th>
              <th>Lagnavn</th>
              <th>Lagleder</th>
              <th>Spillere</th>
              <th>Notat</th>
            </tr>
          </thead>
          <tbody>
            ${teams
              .map(
                (team) => `
              <tr>
                <td data-label="Lag">${escapeHtml(team.name)}</td>
                <td class="blank-cell" data-label="Lagnavn"></td>
                <td data-label="Lagleder">${team.lead ? escapeHtml(team.lead.name) : ''}</td>
                <td data-label="Spillere">
                  <ol>
                    ${team.players
                      .map(
                        (player) => `
                      <li>${escapeHtml(player.name)} <span>${player.age}</span></li>
                    `,
                      )
                      .join('')}
                  </ol>
                </td>
                <td class="blank-cell" data-label="Notat"></td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderHeats(heats) {
  return `
    <section class="print-block">
      <div class="section-heading">
        <h2>Heats</h2>
      </div>
      <div class="heat-bracket-grid">
        ${heats
          .map(
            (heat) => `
          <article class="heat-bracket-card">
            <div class="heat-bracket-heading">
              <h3>${escapeHtml(heat.name)}</h3>
              <div class="heat-winner-slot">Vinner:</div>
            </div>
            ${renderBracket(
              buildBracketRounds(
                padBracketSlots(heat.teams.map((team) => team.name)),
              ),
            )}
          </article>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

function padBracketSlots(slots) {
  const paddedSlots = [...slots];
  const bracketSlots = nextPowerOfTwo(Math.max(2, paddedSlots.length));
  while (paddedSlots.length < bracketSlots) paddedSlots.push('Ledig');
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
    current = matches.map(() => 'Vinner: ');
  }

  return rounds;
}

function renderBracket(rounds) {
  return `
    <div class="visual-bracket visual-bracket-heat">
      ${rounds
        .map(
          (round, index) => `
        <div class="visual-bracket-round">
          <h3>${escapeHtml(getRoundName(rounds.length, index))}</h3>
          <div class="visual-bracket-matches">
            ${round
              .map(
                (match) => `
              <div class="visual-match">
                <span class="visual-match-label">${escapeHtml(match.label)}</span>
                <div class="${getBracketBoxClass(match.teams[0])}">${escapeHtml(match.teams[0] || '')}</div>
                <span class="visual-vs">VS</span>
                <div class="${getBracketBoxClass(match.teams[1])}">${escapeHtml(match.teams[1] || '')}</div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

function getBracketBoxClass(value) {
  return /^Vinner:/.test(String(value || ''))
    ? 'visual-team-box visual-placeholder-box'
    : 'visual-team-box';
}

function renderWarnings(warnings) {
  if (warnings.length === 0) return '';
  return `
    <div class="warning-list">
      ${warnings.map((warning) => `<p>${escapeHtml(warning)}</p>`).join('')}
    </div>
  `;
}

function renderUnused(unused) {
  if (unused.length === 0) return '';
  return `
    <section class="unused-list">
      <h2>Venteliste / ikke brukt</h2>
      <p>${unused.map((person) => `${escapeHtml(person.name)} (${person.age})`).join(', ')}</p>
    </section>
  `;
}

function getRoundName(totalRounds, index) {
  if (index === totalRounds - 1) return 'Finale';
  if (index === totalRounds - 2) return 'Semifinaler';
  if (index === totalRounds - 3) return 'Kvartfinaler';
  return `Runde ${index + 1}`;
}

function nextPowerOfTwo(number) {
  let power = 1;
  while (power < number) power *= 2;
  return power;
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[char],
  );
}
