// @ts-nocheck
var beeminder = require("beeminder");

// USER DATA
export type User = {
  goals: string[];
};

// GOAL DATA
export type GoalSlug = string;
export type GoalRateUnits = "y" | "m" | "w" | "d" | "h";
export type GoalResponse = {
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
