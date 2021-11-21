import { createReadStream } from "fs";
import { createInterface } from "readline";
import {
	distinctUntilChanged,
	filter,
	map,
	mergeMap,
	ReplaySubject,
	scan,
	takeLast
} from "rxjs";

// TODO: Relativize
const PATH = "tags.log";

const lineStream = createInterface(createReadStream(PATH));
lineStream.on("line", (line) => {
  lineStream$.next(line);
});
lineStream.on("close", () => {
  lineStream$.complete();
});

const lineStream$ = new ReplaySubject<String>();

function parseRawTag(line: string[]): RawTag {
  if (line[0]) {
    let tags = line.slice(1, -3); // remove epoch (?) and string timestamp

    return {
      tags: tags,
    } as RawTag;
  }

  throw Error("Line shouldn't be empty.");
}

function categorizeTag(tag: RawTag): Tag {
  const hasGaia = tag.tags.indexOf("gaia") !== -1;
  const hasWork = tag.tags.indexOf("work") !== -1;

  return {
    category: hasGaia || hasWork ? "work" : "uncategorized",
    tags: tag.tags,
  };
}

const dataStream$ = lineStream$.pipe(
  map((l) => l.split(" ").filter((x) => x !== "")),
  map(parseRawTag),
  map(categorizeTag)
);

const workData$ = dataStream$.pipe(filter((tag) => tag.category == "work"));

const uncategorizedData$ = dataStream$.pipe(
  filter((tag) => tag.category == "uncategorized")
);

workData$
  .pipe(
    scan((minutes, _) => minutes + 45, 0),
    takeLast(1),
    map((minutes) => minutes / 60)
  )
  .subscribe((x) => console.log(`Worked ${x} hours in the period.`));

uncategorizedData$
  .pipe(
    mergeMap((tag) => tag.tags),
    distinctUntilChanged(),
    scan((tags, tag) => tags.add(tag), new Set()),
    distinctUntilChanged((prev, curr) => prev.size !== curr.size),
	filter(uncategorizedTagSet => uncategorizedTagSet.size > 0),
	takeLast(1)
  )
  .subscribe(uncategorizedTagSet => {
	console.log(`There are ${uncategorizedTagSet.size} uncategorized sets.`);
	console.log(`${[...uncategorizedTagSet.values()]}`);
  });
