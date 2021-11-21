import { map } from "rxjs";
import {
  Goal,
  goalDataRequested$,
  goalDataStream$,
  userDataRequested$,
  userDataStream$,
} from "./beeminder";

userDataStream$.pipe(map((user) => user.goals)).subscribe((x) => {
  x.forEach((goalName) => goalDataRequested$.next(goalName));
});
userDataRequested$.next(null);

const weeklyRateStream = goalDataStream$
  .pipe(map(goalAtWeeklyRate))
  .subscribe();

function goalAtWeeklyRate(g: Goal): Goal {
  if (g.rate.unit === "w") {
    return g;
  }

  let multiplier: number;
  switch (g.rate.unit) {
    case "d":
      multiplier = 7;
      break;
    case "h":
      multiplier = 7 * 24;
      break;
    case "m":
      multiplier = 1 / 4;
      break;
    case "y":
      multiplier = 1 / 52;
      break;
  }

  g.rate = {
    unit: "w",
    value: g.rate.value * multiplier,
  };

  return g;
}
