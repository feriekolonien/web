export default function TeamTable({ teams }) {
  return (
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
            {teams.map((team) => (
              <tr key={team.id}>
                <td data-label="Lag">{team.name}</td>
                <td class="blank-cell" data-label="Lagnavn"></td>
                <td data-label="Lagleder">{team.lead ? team.lead.name : ""}</td>
                <td data-label="Spillere">
                  <ol>
                    {team.players.map((player) => (
                      <li key={player.id}>
                        {player.name} <span>{player.age}</span>
                      </li>
                    ))}
                  </ol>
                </td>
                <td class="blank-cell" data-label="Notat"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
