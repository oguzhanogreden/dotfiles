type RawTag = {
  tags: string[];
};

type Category = "work" | "sleep" | "uncategorized";

type Tag = RawTag & {
  category: Category;
};
