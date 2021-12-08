import { AsyncSubject, map, ReplaySubject, Subject } from "rxjs";

// @ts-nocheck
var beeminder = require("beeminder");

const TOKEN = process.env.BEEMINDER_TOKEN;
if (!TOKEN) {
  throw new Error("BEEMINDER_TOKEN is not set.")
}
var bm = beeminder(TOKEN);

// USER DATA
export type User = {
  goals: string[];
};

const _userDataStream = new AsyncSubject<User>();
function getGoalNames() {
  bm.getUser(function (err: any, result: User) {
    if (err) {
      throw new Error("While getting data.");
    }

    _userDataStream.next(result);
    _userDataStream.complete();
  });
}

export const userDataStream$ = _userDataStream.asObservable();
export const userDataRequested$ = new Subject<null>();

userDataRequested$.subscribe((_) => getGoalNames());

// GOAL DATA
export type GoalSlug = string;
export type GoalRateUnits = "y" | "m" | "w" | "d" | "h";
type GoalResponse = {
  slug: GoalSlug;
  rate: number;
  runits: GoalRateUnits;
  title: string;
  gunits: string;
};

export type GoalRate = {
  value: number;
  unit: GoalRateUnits;
  gunit: string;
};
export type Goal = {
  slug: GoalSlug;
  rate: GoalRate;
  title: string;
};

let _goalDataStream = new ReplaySubject<GoalResponse>();
function getGoal(goalName: GoalSlug) {
  bm.getGoal(goalName, function (err: any, result: GoalResponse) {
    if (err) {
      throw new Error(`Can't get goal ${goalName}`);
    }

    _goalDataStream.next(result);
  });
}

export const goalDataRequested$ = new Subject<GoalSlug>();
export const goalDataStream$ = _goalDataStream.pipe(
  map((response) => {
    // if (response.slug === 'beard') {
    //   console.log(response)
    // }
    // if (response.slug === 'reading') {
    //   console.log(response)
    // }

    // console.log

    return {
      rate: {
        value: response.rate,
        unit: response.runits,
        gunit: response.gunits,
      },
      slug: response.slug,
      title: response.title,
    } as Goal;
  })
);

goalDataRequested$.subscribe((goalName) => getGoal(goalName));
