import currency from "currency.js";
import { createReadStream } from "fs";
import { DateTime } from "luxon";
import { createInterface } from "readline";
import {
  filter,
  interval,
  map,
  pipe,
  ReplaySubject,
  sample,
  scan,
  skip,
  Subject,
  takeUntil,
  tap,
} from "rxjs";

const PATH = "mutations20211124211718.csv";

const lineStream = createInterface(createReadStream(PATH));
lineStream.on("line", (line) => {
  lineStream$.next(line);
});
lineStream.on("close", () => {
  lineStream$.complete();
});
const lineStream$ = new ReplaySubject<string>();

// TRIODOS
function parseTriodosFile() {
  return pipe(skip(1), untilTriodosEndLine());
}

function untilTriodosEndLine() {
  const TRIODOS_END_LINE = ";;;;;;;";

  return pipe(
    tap((x: string) => {
      if (x === TRIODOS_END_LINE) {
        triodosDataEnded.next(0);
      }
    })
  );
}

const splitRow = () => pipe(map((row: string) => row.split(";")));

const parseRow = () =>
  pipe(
    map((row: string[]) => {
      const ROW_LENGTH = 8;

      if (row.length > ROW_LENGTH) {
        console.log(row);
        throw new Error("parseRow");
      }

      return {
        date: DateTime.fromFormat(row[0] ?? "", "d-MM-yyyy"),
        account: row[1],
        amount: currency(row[2] ?? "", {
          decimal: ",",
          separator: ".",
          symbol: "€",
          errorOnInvalid: true,
        }),
        type: row[3] as TriodosTransactionType,
        name: row[4],
        otherAccount: row[5],
        type2: row[6] as TriodosTransactionTypeAbbreviation,
        description: row[7],
      } as Triodos;
    })
  );

const parseRowTests = () =>
  pipe(
    tap((row: Triodos) => {
      if (!row.date.isValid)
        throw Error(`Date is not valid: ${row.date.invalidExplanation}`);

      const knownTypes: TriodosTransactionType[] = ["Debet", "Credit"];
      const type = row.type;
      if (knownTypes.indexOf(type) === -1)
        throw Error(`Transaction type is not valid: ${type}`);
    })
  );

class TestError implements Error {
  name = "TestError";
  message: string;
  stack = undefined;
  row: string;

  constructor(message: string, row: string) {
    this.message = message;
    this.row = row;
  }
}

type IBAN = string;
type TriodosTransactionType = "Debet" | "Credit";
type TriodosTransactionTypeAbbreviation = string;

type Triodos = {
  date: DateTime;
  account: IBAN;
  amount: currency;
  type: TriodosTransactionType;
  name: string;
  otherAccount: string;
  type2: TriodosTransactionTypeAbbreviation;
};

const triodosDataEnded = new Subject();
const triodosDataStream$ = lineStream$.pipe(
  parseTriodosFile(),
  splitRow(),
  parseRow(),
  parseRowTests(),
  takeUntil(triodosDataEnded)
  //   take(1)
);

class Budget {
  private _income = 0;
  private _transactions = new ReplaySubject<Triodos>();

  constructor() {}

  processTriodosTransaction(t: Triodos) {
    this._transactions.next(t);
  }

  // TODO: Reactive refactor with: start and end date
  get income() {
    return this._transactions.pipe(
      filter((t) => t.type === "Credit"),
      scan((income, t) => income.add(t.amount), currency(0))
    );
  }
}

const budget = new Budget();
triodosDataStream$.subscribe({
  next: (t) => budget.processTriodosTransaction(t),
});

const sampleTick$ = interval(10);

budget.income
  .pipe(sample(sampleTick$))
  .subscribe((i) => console.log(`Total: ${i.toString()}.`));
