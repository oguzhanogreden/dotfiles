import currency from "currency.js";
import { createReadStream } from "fs";
import { DateTime } from "luxon";
import { createInterface } from "readline";
import {
  interval,
  map,
  pipe,
  ReplaySubject, scan,
  skip,
  Subject,
  takeUntil,
  tap
} from "rxjs";
import { filter } from "rxjs/operators";

// TRIODOS
function parseFile(bank: "ING" | "Triodos") {
  switch (bank) {
    case "ING":
      return pipe(skip<string>(1));
    case "Triodos":
      return pipe(skip(1), untilEndLine(TRIODOS_END_LINE));
  }
}

const TRIODOS_END_LINE = ";;;;;;;";
function untilEndLine(endLine: string) {
  return pipe(
    tap((x: string) => {
      if (x.trim() === endLine) {
        dataEnded.next(0);
      }
    })
  );
}

const splitRow = (bank: Bank) => pipe(map((row: string) => {
  switch (bank) {
    case 'ING':
      return row.split(",");
    case 'Triodos':
      return row.split(";")
  }
}));

type Bank = "ING" | "Triodos";

const parseRow = (bank: Bank) => {
  switch (bank) {
    case 'ING':
      return pipe(
        map((row: string[]) => {
          const MAX_ROW_LENGTH = 10;

          const rowLength = row.length;
          if (rowLength > MAX_ROW_LENGTH) {
            throw new Error(`Row length (${rowLength}) is larger than maximum ${MAX_ROW_LENGTH}`);
          }

          const regex = /"/g;
          const trimQuotes = (x?: string) => x?.replace(regex, "");

          row = row.map(r => trimQuotes(r) ?? "");

          return {
            date: DateTime.fromFormat(row[0] ?? "", "yyyyMMdd"),
            account: row[2],
            amount: currency(row[6] ?? "", {
              decimal: ",",
              separator: ".",
              symbol: "€",
              errorOnInvalid: true,
            }),
            type: row[5] as INGTransactionType === "Bij" ? "TO" : "FROM",
            name: row[1],
            otherAccount: row[3],
            type2: row[4] as TransactionTypeAbbreviation,
            description: row[8],
          } as Transaction;

        }));
    case "Triodos":
      return pipe(
        map((row: string[]) => {
          const MAX_ROW_LENGTH = 8;

          const rowLength = row.length;
          if (rowLength > MAX_ROW_LENGTH) {
            throw new Error(`Row length (${rowLength}) is larger than maximum ${MAX_ROW_LENGTH}`);
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
            type: row[3] as TriodosTransactionType === "Credit" ? "TO" : "FROM",
            name: row[4],
            otherAccount: row[5],
            type2: row[6] as TransactionTypeAbbreviation,
            description: row[7],
          } as Transaction;
        })
      );
  }
}

const parseRowTests = () =>
  pipe(
    //   tap((row: Transaction) => {
    //     if (!row.date.isValid)
    //       throw Error(`Date is not valid: ${row.date.invalidExplanation}`);

    //     const knownTypes: TriodosTransactionType[] = ["Debet", "Credit"];
    //     const type = row.type;
    //     if (knownTypes.indexOf(type) === -1)
    //       throw Error(`Transaction type is not valid: ${type}`);
    //   })
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
type TransactionType = "FROM" | "TO";
type TransactionTypeAbbreviation = string;

type TriodosTransactionType = "Debet" | "Credit";
type INGTransactionType = "Af" | "Bij";

type Transaction = {
  date: DateTime;
  account: IBAN;
  amount: currency;
  type: TransactionType;
  name: string;
  otherAccount: string;
  type2: TransactionTypeAbbreviation;
};

class Budget {
  private _income = 0;
  private _transactions = new ReplaySubject<Transaction>();

  constructor() { }

  processTransaction(t: Transaction) {
    this._transactions.next(t);
  }

  // TODO: Reactive refactor with: start and end date
  get income() {
    return this._transactions.pipe(
      tap(t => console.log(t)),
      filter((t) => t.type === "TO"),
      scan((income, t) => income.add(t.amount), currency(0))
    );
  }
}

const PATH = "NL28INGB0388729732_01-02-2022_05-07-2022.csv";

const lineStream$ = new ReplaySubject<string>();
const lineStream = createInterface(createReadStream(PATH));
lineStream.on("line", (line) => {
  lineStream$.next(line);
});
lineStream.on("close", () => {
  dataEnded.next(0);
  lineStream$.complete();
});

const dataEnded = new Subject();
let bank: Bank = "ING";
const dataStream$ = lineStream$.pipe(
  parseFile(bank),
  splitRow(bank),
  parseRow(bank),
  parseRowTests(),
  takeUntil(dataEnded)
  //   take(1)
);

const budget = new Budget();
dataStream$.subscribe({
  next: (t) => budget.processTransaction(t),
  complete: () => console.log("dataStream$ completed")
});

const sampleTick$ = interval(10);

budget.income
  // .pipe(sample(sampleTick$))
  .subscribe((i) => console.log(`Total: ${i.toString()}.`));
