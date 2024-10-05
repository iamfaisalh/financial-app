import { useEffect, useState } from "react";
import api from "../api";
import { Divider } from "../components/Divider";
import { Text } from "../components/Text";
import { Link } from "../components/Link";
import { Transaction, UserStock } from "../redux/reducers/stocks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/Table";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "../components/Pagination";
import { formatMoney } from "../util/functions";

interface PaginationState {
  transactions: Transaction[];
  page: number;
  per_page: number;
  total_transactions: number | null;
  has_next: boolean;
  has_prev: boolean;
}

const initialPaginationState = {
  transactions: [],
  page: 1,
  per_page: 10,
  total_transactions: null,
  has_next: false,
  has_prev: false,
};

export default function Portfolio() {
  const [portfolioLoading, setPortfolioLoading] = useState<boolean>(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<UserStock[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );
  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialPaginationState
  );
  const [nextPage, setNextPage] = useState<number>(1);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get("/users/me/portfolio");
        setPortfolio(response.data as UserStock[]);
      } catch (error: any) {
        setPortfolioError("Something went wrong fetching your portfolio");
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => setTransactionsLoading(true), [nextPage]);

  useEffect(() => {
    const fetchPaginatedTransactions = async () => {
      try {
        const response = await api.get(
          `/users/me/transactions?page=${nextPage}&per_page=10`
        );
        setPaginationState(response.data);
      } catch (error: any) {
        console.log(error?.response?.data?.message);
        setTransactionsError("Something went wrong fetching your transactions");
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchPaginatedTransactions();
  }, [nextPage]);

  return (
    <div>
      <p className="text-xl font-bold">Your Stocks</p>
      <div className="flex flex-wrap gap-3 items-center my-2 p-2">
        {!portfolioLoading &&
          (portfolioError ? (
            <p className="text-zinc-500 dark:text-zinc-400 block py-9 w-full text-center text-lg">
              {portfolioError}
            </p>
          ) : portfolio.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 block py-9 w-full text-center text-lg">
              You currently do not have any stocks
            </p>
          ) : (
            portfolio.map((userStock) => (
              <Link
                to={`/stocks/${userStock.stock.symbol}`}
                key={userStock.id} //max-w-80
                className={
                  "w-full max-w-52 min-w-fit border border-zinc-950/10 dark:border-white/10 ring-zinc-950/10 dark:ring-white/10 rounded-lg"
                }
              >
                <p className="w-full block font-semibold p-3 truncate">
                  {userStock.stock.company_name}
                </p>
                <Divider />
                <div className="p-3 w-full">
                  <Text>
                    {userStock && userStock.quantity === 1
                      ? "1 share"
                      : userStock && userStock.quantity > 1
                      ? `${userStock.quantity} shares`
                      : "0 shares"}
                  </Text>
                </div>
              </Link>
            ))
          ))}
      </div>
      <p className="text-xl font-bold mt-10">
        Transaction History
        {paginationState.total_transactions &&
        paginationState.total_transactions > 0 ? (
          <> ({paginationState.total_transactions})</>
        ) : null}
      </p>
      <div className="w-full my-2 p-2">
        {!transactionsLoading &&
          (transactionsError ? (
            <p className="text-zinc-500 dark:text-zinc-400 block py-9 w-full text-center text-lg">
              {transactionsError}
            </p>
          ) : paginationState.transactions.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 block py-9 w-full text-center text-lg">
              No transactions found
            </p>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Stock</TableHeader>
                    <TableHeader>Type (buy/sell)</TableHeader>
                    <TableHeader>Shares</TableHeader>
                    <TableHeader>Price Per Share</TableHeader>
                    <TableHeader>Total Price</TableHeader>
                    <TableHeader>Date</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginationState.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.stock.symbol}
                      </TableCell>
                      <TableCell>{transaction.transaction_type}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>
                        {formatMoney(transaction.cost_per_share)}
                      </TableCell>
                      <TableCell>
                        {formatMoney(transaction.total_cost)}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {paginationState.total_transactions &&
                paginationState.total_transactions > 0 && (
                  <Pagination className="mt-6">
                    <PaginationPrevious
                      hasPrevious={paginationState.has_prev}
                      onClick={() => {
                        if (paginationState.has_prev)
                          setNextPage(paginationState.page - 1);
                      }}
                    />
                    {/* <PaginationList>
                  {paginationState.}
                  <PaginationPage></PaginationPage>
                  <PaginationGap />
                  <PaginationPage></PaginationPage>
                </PaginationList> */}
                    <PaginationNext
                      hasNext={paginationState.has_next}
                      onClick={() => {
                        if (paginationState.has_next)
                          setNextPage(paginationState.page + 1);
                      }}
                    />
                  </Pagination>
                )}
            </>
          ))}
      </div>
    </div>
  );
}
