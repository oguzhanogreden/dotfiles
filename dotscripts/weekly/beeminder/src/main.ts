import { filter, map, scan } from "rxjs";
import { Goal } from "./beeminder";
import { Client } from "./client-wrapper";

const TOKEN = process.env.BEEMINDER_TOKEN;
if (!TOKEN) {
  throw new Error("BEEMINDER_TOKEN is not set.");
}

var client = new Client(TOKEN);
client.getGoalNames();

client.userDataStream$.pipe(map((user) => user.goals)).subscribe((x) => {
  x.forEach((goalName) => client.getGoalData(goalName));
});

const timeCommitmentStream$ = client.goalDataStream$
  .pipe(
    filter((x) => x.title.indexOf("⏲") !== -1),
    filter((x) => x.title.indexOf("🐝") === -1), // filter out work
    map(goalAtWeeklyRateInHours),
    scan((total, goal) => total + goal.rate.value, 0)
  )
  .subscribe((x) => console.log(`Your weekly commitment is ${x} hours.`));

function goalAtWeeklyRateInHours(g: Goal): Goal {
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

  let goalUnitIsMinutes = g.rate.gunit === "minute";

  if (goalUnitIsMinutes) {
    g.rate.value = g.rate.value / 60;
    g.rate.gunit = "hours";
  }

  g.rate = {
    unit: "w",
    value: g.rate.value * multiplier,
    gunit: g.rate.gunit,
  };

  return g;
}
