import { filter, map, scan } from "rxjs";
import {
  Goal,
  goalDataRequested$,
  goalDataStream$,
  userDataRequested$,
  userDataStream$
} from "./beeminder";

userDataStream$.pipe(map((user) => user.goals)).subscribe((x) => {
  x.forEach((goalName) => goalDataRequested$.next(goalName));
});
userDataRequested$.next(null);

const timeCommitmentStream$ = goalDataStream$
.pipe(
  filter(x => x.title.indexOf("⏲") !== -1),
  filter(x => x.title.indexOf("🐝") === -1), // filter out work
  map(goalAtWeeklyRate),
  scan((total, goal) => total + goal.rate.value, 0),
)
.subscribe(x => console.log(`Your weekly commitment is ${x} hours.`));


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
