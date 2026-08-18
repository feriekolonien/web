export const SEASON_PHASE = Object.freeze({
  BEFORE_REGISTRATION: "before-registration",
  REGISTRATION_OPEN: "registration-open",
  WAITLIST: "waitlist",
  ENDED: "ended",
});

export function getSeasonPhase(season, now = new Date()) {
  const nowTime = now.getTime();
  const registrationOpensAt = new Date(season.registrationOpensAt).getTime();
  const registrationDeadlineAt = new Date(
    season.registrationDeadlineAt,
  ).getTime();
  const endsAt = new Date(season.endsAt).getTime();

  if (
    [nowTime, registrationOpensAt, registrationDeadlineAt, endsAt].some(
      (value) => Number.isNaN(value),
    )
  ) {
    throw new TypeError("Season dates must be valid ISO 8601 date strings");
  }

  if (nowTime < registrationOpensAt) {
    return SEASON_PHASE.BEFORE_REGISTRATION;
  }

  if (nowTime <= registrationDeadlineAt) {
    return SEASON_PHASE.REGISTRATION_OPEN;
  }

  if (nowTime <= endsAt) {
    return SEASON_PHASE.WAITLIST;
  }

  return SEASON_PHASE.ENDED;
}
