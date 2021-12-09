import { GoalSlug } from "beeminder-weekly/beeminder";
import { map, ReplaySubject, shareReplay, Subject } from "rxjs";

var _beeminder = require("beeminder");

export type Goal = {
  slug: string;
  rate: GoalRate;
  title: string;
};

export type GoalRate = {
  value: number;
  unit: GoalRateUnits;
  gunit: string;
};

export type GoalRateUnits = "y" | "m" | "w" | "d" | "h";

export type User = {
  goals: string[];
};

export class Client {
  private _client: IClient;
  private _userDataStream = new Subject<User>();
  private _goalDataStream = new ReplaySubject<GoalResponse>();

  userDataStream$ = this._userDataStream.pipe(shareReplay(1));
  goalDataStream$ = this._goalDataStream.pipe(
    map((response) => {
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

  constructor(token: string) {
    this._client = _beeminder(token);
  }

  getGoalNames() {
    this._client.getUser(this.getGoalNamesCallback);
  }

  getGoalData(slug: GoalSlug) {
    this._client.getGoal(slug, this.getGoalDataCallback);
  }

  private getGoalDataCallback(err: any, result: GoalResponse) {
    // TODO: Should be in the reactive code?
    if (err) {
      throw new Error("Can't get goal.");
    }

    this._goalDataStream.next(result);
  }

  private getGoalNamesCallback(err: any, result: User) {
    // TODO: Should be in the reactive code?
    if (err) {
      throw new Error("While getting data.");
    }

    this._userDataStream.next(result);
  }
}

type Callback<T> = (err: any, result: T) => void;

type IClient = {
  getUser: (cb: Callback<User>) => void;
  getGoal: (goalName: string, cb: Callback<GoalResponse>) => void;
};

type GoalResponse = {
  slug: string;
  rate: number;
  runits: GoalRateUnits;
  title: string;
  gunits: string;
};
