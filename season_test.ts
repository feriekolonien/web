import { season } from "./season.ts";
import { getSeasonPhase, SEASON_PHASE } from "./assets/season.js";

function assertEquals(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assertThrows(fn: () => unknown, message: string) {
  try {
    fn();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes(message)) {
      return;
    }
    throw error;
  }

  throw new Error("Expected function to throw");
}

Deno.test("season phases change at the configured boundaries", () => {
  assertEquals(
    getSeasonPhase(season, new Date("2025-12-24T11:59:59+01:00")),
    SEASON_PHASE.BEFORE_REGISTRATION,
  );
  assertEquals(
    getSeasonPhase(season, new Date(season.registrationOpensAt)),
    SEASON_PHASE.REGISTRATION_OPEN,
  );
  assertEquals(
    getSeasonPhase(season, new Date("2026-06-02T00:00:00+02:00")),
    SEASON_PHASE.WAITLIST,
  );
  assertEquals(
    getSeasonPhase(season, new Date(season.endsAt)),
    SEASON_PHASE.WAITLIST,
  );
  assertEquals(
    getSeasonPhase(season, new Date("2026-08-07T00:00:00+02:00")),
    SEASON_PHASE.ENDED,
  );
});

Deno.test("season phases reject invalid dates", () => {
  assertThrows(
    () => getSeasonPhase({ ...season, endsAt: "not-a-date" }),
    "Season dates must be valid ISO 8601 date strings",
  );
});
