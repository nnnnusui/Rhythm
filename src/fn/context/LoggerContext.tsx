import { getLogger } from "@logtape/logtape";
import { ParentProps, createContext, useContext } from "solid-js";

const rootCategories = ["rhythm"];
const LoggerCategoryContext = createContext<string[]>(rootCategories);

/** @public */
export const LoggerProvider = (p: ParentProps<{
  categories: string[] | string;
}>) => {
  const parentCategories = useContext(LoggerCategoryContext);
  const categories = () => typeof p.categories === "string"
    ? [p.categories]
    : p.categories;

  return (
    <LoggerCategoryContext.Provider
      value={[
        ...parentCategories,
        ...categories(),
      ]}
    >
      {p.children}
    </LoggerCategoryContext.Provider>
  );
};

/** @public */
export const useLogger = (categories?: string[] | string) => {
  const parentCategories = useContext(LoggerCategoryContext);

  return getLogger([
    ...parentCategories,
    ...(typeof categories === "string" ? [categories] : categories ?? []),
  ]);
};
