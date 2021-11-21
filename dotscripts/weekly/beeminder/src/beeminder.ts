import { AsyncSubject, map, ReplaySubject, Subject } from "rxjs";

// @ts-nocheck
var beeminder = require("beeminder");

const TOKEN = "";
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
};

export type GoalRate = {
  value: number;
  unit: GoalRateUnits;
};
export type Goal = {
  slug: GoalSlug;
  rate: GoalRate;
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
    return {
      rate: {
        value: response.rate,
        unit: response.runits,
      },
      slug: response.slug,
    } as Goal;
  })
);

goalDataRequested$.subscribe((goalName) => getGoal(goalName));
