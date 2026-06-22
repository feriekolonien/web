import { render } from "preact";
import TournamentApp from "../../_tournament/components/TournamentApp.jsx";

const root = document.getElementById("tournament-root");

if (root) {
  render(<TournamentApp />, root);
}
