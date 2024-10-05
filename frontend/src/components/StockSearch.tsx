import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { InputGroup, Input } from "./Input";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Link } from "./Link";
import { useNavigate } from "react-router-dom";
import { Badge } from "./Badge";
import { Text } from "./Text";
import { Stock } from "../redux/reducers/stocks";
import { useAppSelector } from "../redux/store";

// binary search for string prefix since it's already sorted
const findStartIndex = (stocks: Stock[], query: string): number => {
  let left = 0;
  let right = stocks.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const symbol = stocks[mid].symbol;

    if (symbol.startsWith(query)) {
      // continue searching left to find more matches
      right = mid - 1;
    } else if (symbol < query) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left; // left is the first index where the prefix could match
};

// search for relevant stocks based on the starting index of the binary search
const searchStocks = (
  stocks: Stock[],
  query: string,
  limit = 5
  // query_limit?: number
): Stock[] => {
  const upperQuery = query.toUpperCase();
  const results: Stock[] = [];
  const seenSymbols = new Set<string>();
  // const limit = query_limit || stocks.length;

  const startIndex = findStartIndex(stocks, upperQuery);

  for (let i = startIndex; i < stocks.length && results.length < limit; i++) {
    const stock = stocks[i];

    if (stock.symbol.startsWith(upperQuery) && !seenSymbols.has(stock.symbol)) {
      results.push(stock);
      seenSymbols.add(stock.symbol);
    }
  }

  // if fewer than <limit> results, continue searching by companyNameUpper
  if (results.length < limit) {
    for (const stock of stocks) {
      if (
        stock.company_name_upper.startsWith(upperQuery) &&
        !seenSymbols.has(stock.symbol)
      ) {
        results.push(stock);
        seenSymbols.add(stock.symbol);
      }
      if (results.length === limit) return results; // stop if we have <limit> results
    }
  }

  return results;
};

export default function StockSearch() {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const stocks = useAppSelector((state) => state.stocks.data);
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const queryValue = e.target.value;
    setQuery(queryValue);

    if (!isOpen) setIsOpen(true);

    if (queryValue.trim() !== "") {
      const results = searchStocks(stocks, queryValue);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    // check if the ref is defined and contains the target
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsOpen(false); // close the search results dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // add the event listener

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // cleanup on unmount
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prevIndex) => {
        // move down the list and wrap around
        return (prevIndex + 1) % searchResults.length;
      });
      e.preventDefault(); // prevent default scrolling behavior
    } else if (e.key === "ArrowUp") {
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prevIndex) => {
        // move up the list and wrap around
        return (prevIndex - 1 + searchResults.length) % searchResults.length;
      });
      e.preventDefault(); // prevent default scrolling behavior
    } else if (e.key === "Enter") {
      if (searchResults.length > 0 && searchResults[activeIndex]) {
        navigate(`/stocks/${searchResults[activeIndex].symbol}`);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={searchRef} className="relative mx-auto flex-1 max-w-md">
      <InputGroup className={"w-full"}>
        <MagnifyingGlassIcon />
        <Input
          value={query}
          onChange={handleInputChange}
          className={"outline-none ring-0"}
          autoComplete="off"
          onKeyDown={handleKeyDown}
          placeholder="Search for a stock&hellip;"
          aria-label="Search"
          onClick={() => (!isOpen ? setIsOpen(true) : null)}
          // onFocus={() => setIsOpen(true)}
        />
      </InputGroup>
      {isOpen && query && (
        <ul
          className={clsx([
            // Basic layout
            "absolute mt-1 top-full w-full list-none z-[1] max-h-52 overflow-y-auto rounded-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
            // Typography
            "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
            // Border
            "border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20",
            // Background color
            "bg-white dark:bg-zinc-900",
            // System icons
            "dark:[color-scheme:dark]",
          ])}
        >
          {searchResults.length > 0 ? (
            searchResults.map((stock, index) => (
              <Link
                key={stock.symbol}
                to={`/stocks/${stock.symbol}`}
                onClick={() => setIsOpen(false)}
              >
                <li
                  className={clsx(
                    "flex w-full py-1 gap-2 dark:hover:bg-white/5 hover:bg-zinc-950/5 px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]",
                    index === activeIndex && "dark:bg-white/5 bg-zinc-950/5"
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className="min-w-16 pr-2">
                    <Badge color="green">{stock.symbol}</Badge>
                  </span>
                  <Text title={stock.company_name} className="truncate">
                    {stock.company_name}
                  </Text>
                </li>
              </Link>
            ))
          ) : (
            <li className="text-center p-2 w-full">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
