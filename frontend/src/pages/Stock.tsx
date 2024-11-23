import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Highcharts, { Options } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { LoadingFullScreen } from "../components/Loading";
import { useAppSelector } from "../redux/store";
import { UserStock } from "../redux/reducers/stocks";
import { formatMoney } from "../util/functions";
import clsx from "clsx";
import { Divider } from "../components/Divider";
import { Text } from "../components/Text";
import { TextTruncateToggle } from "../components/TextTruncateToggle";
import { Button } from "../components/Button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "../components/Dialog";
import { ErrorMessage, Field, Label } from "../components/Fieldset";
import { Input } from "../components/Input";
import { Avatar } from "../components/Avatar";

// interface StockData {
//   Close: number;
//   Datetime: string;
//   Dividends: number;
//   High: number;
//   Low: number;
//   Open: number;
//   "Stock Splits": number;
//   Volume: number;
// }

interface StockInfo {
  longName: string;
  longBusinessSummary: string;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  currentPrice: number;
  previousClose: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  industry: string;
  sector: string;
  volume: number;
  averageVolume: number;
  ask: number;
  askSize: number;
  bid: number;
  bidSize: number;
  website: string;
  marketCap: number;
  open: number;
  symbol: string;
  dayHigh: number;
  dayLow: number;
  currency: number;
  city: string;
  state: string;
  fullTimeEmployees: number;
}

export default function Stock() {
  const theme = useAppSelector((state) => state.theme.mode);
  const { symbol } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<"Buy" | "Sell">("Buy");
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const [quantityInput, setQuantityInput] = useState<number>(1);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [userStock, setUserStock] = useState<UserStock | null>(null);
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);

  const backgroundColor = theme === "dark" ? "#18181b" : "#FFFFFF";
  const color = theme === "dark" ? "#FFFFFF" : "#09090b";
  const grey = theme === "dark" ? "#a1a1aa" : "#71717a";
  const hover =
    theme === "dark" ? "rgb(255 255 255 / 0.05)" : "rgb(9 9 11 / 0.05)";

  const [chartOptions, setChartOptions] = useState<Options>({
    title: {
      text: `${symbol} Stock Price`,
      style: {
        color: color,
        backgroundColor: backgroundColor,
      },
    },
    accessibility: {
      enabled: false,
    },
    series: [
      {
        name: `${symbol} Stock Price`,
        data: [],
        type: "areaspline",
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: color,
          backgroundColor: backgroundColor,
        },
      },
    },
    yAxis: {
      title: {
        text: "Stock Price (USD)",
        style: {
          color: color,
          backgroundColor: backgroundColor,
        },
      },
      labels: {
        style: {
          color: color,
          backgroundColor: backgroundColor,
        },
      },
    },
    rangeSelector: {
      buttonTheme: {
        fill: "none",
        stroke: "none",
        "stroke-width": 0,
        r: 4,
        style: {
          color: color,
        },
        states: {
          select: {
            fill: hover,
            style: {
              color: color,
            },
          },
          hover: {
            fill: "none",
            stroke: color,
            "stroke-width": 1,
            style: {
              color: color,
            },
          },
        },
      },
    },
    chart: {
      style: {
        backgroundColor: backgroundColor,
        color: color,
      },
    },
    scrollbar: {
      barBackgroundColor: grey,
    },
    tooltip: {
      backgroundColor: backgroundColor,
      style: {
        color: color,
      },
    },
  });

  useEffect(() => {
    const xbackgroundColor = theme === "dark" ? "#18181b" : "#FFFFFF";
    const xcolor = theme === "dark" ? "#FFFFFF" : "#09090b";
    const xgrey = theme === "dark" ? "#a1a1aa" : "#71717a";
    const xhover =
      theme === "dark" ? "rgb(255 255 255 / 0.05)" : "rgb(9 9 11 / 0.05)";

    setChartOptions((prevOptions) => ({
      ...prevOptions,
      title: {
        ...prevOptions.title,
        style: {
          color: xcolor,
          backgroundColor: xbackgroundColor,
        },
      },
      xAxis: {
        type: "datetime",
        labels: {
          style: {
            color: xcolor,
            backgroundColor: xbackgroundColor,
          },
        },
      },
      yAxis: {
        title: {
          text: "Stock Price (USD)",
          style: {
            color: xcolor,
            backgroundColor: xbackgroundColor,
          },
        },
        labels: {
          style: {
            color: xcolor,
            backgroundColor: xbackgroundColor,
          },
        },
      },
      chart: {
        backgroundColor: xbackgroundColor,
      },
      scrollbar: {
        barBackgroundColor: xgrey,
      },
      rangeSelector: {
        buttonTheme: {
          fill: "none",
          stroke: "none",
          "stroke-width": 0,
          r: 4,
          style: {
            color: xcolor,
          },
          states: {
            select: {
              fill: xhover,
              style: {
                color: xcolor,
              },
            },
            hover: {
              fill: "none",
              stroke: xcolor,
              "stroke-width": 1,
              style: {
                color: xcolor,
              },
            },
          },
        },
      },
      tooltip: {
        backgroundColor: xbackgroundColor,
        style: {
          color: xcolor,
        },
      },
    }));
  }, [theme]);

  useEffect(() => {
    setLoading(true);
  }, [symbol]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await api.get(`/stocks/${symbol}`);
        if (response.data.info) setStockInfo(response.data.info as StockInfo);
        else setStockInfo(null);
        if (response.data.user_stock)
          setUserStock(response.data.user_stock as UserStock);
        else setUserStock(null);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          title: {
            ...prevOptions.title,
            text: `${symbol} Stock Price`,
          },
          series: [
            {
              name: `${symbol} Stock Price`,
              data: response.data.data || [],
              type: "areaspline",
              threshold: null,
              tooltip: {
                valueDecimals: 2,
              },
              // fillColor: "red",
              // color: "green",
            },
          ],
        }));
      } catch (error: any) {
        console.log(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  const resetTransactionForm = (value: boolean) => {
    if (transactionLoading) return;
    setDialogIsOpen(value);
    setQuantityInput(1);
    setQuantityError(null);
    setTransactionType("Buy"); // restore to default state
  };

  const handleTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setTransactionLoading(true);
      if (!stockInfo) throw new Error("Missing stock info");
      const current_price = stockInfo.currentPrice;
      const body: { symbol: string; quantity: number; current_price: number } =
        {
          symbol: symbol!,
          quantity: quantityInput,
          current_price,
        };

      if (body.quantity <= 0)
        throw new Error("Quantity must be a positive integer greater than 0");

      if (transactionType === "Sell" && userStock?.quantity! < body.quantity)
        throw new Error("You don't have enough shares to sell");

      const response = await api.post(
        `/stocks/${transactionType.toLowerCase()}`,
        body
      );

      if (response.data.new_user_stock)
        setUserStock(response.data.new_user_stock);
      else {
        setUserStock((prev) => {
          if (!prev) return prev;
          else
            return {
              ...prev,
              quantity: response.data.quantity,
            };
        });
      }
      resetTransactionForm(false);
      // display success alert
    } catch (error: any) {
      setQuantityError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  if (loading) return <LoadingFullScreen fixed={true} />;
  if (!stockInfo)
    return (
      <div className="p-10 text-center text-2xl">
        No stock information found
      </div>
    );
  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="min-w-fit">
          <p className="text-2xl font-bold">{stockInfo.longName}</p>
          <p className="text-2xl font-bold">
            {formatMoney(stockInfo.currentPrice)}
          </p>
          <p
            className={clsx(
              "text-sm font-bold",
              stockInfo.regularMarketChange > 0
                ? "text-green-500"
                : "text-red-500"
            )}
          >
            {stockInfo.regularMarketChange > 0 ? (
              <>
                +{formatMoney(stockInfo.regularMarketChange)} (+
                {stockInfo.regularMarketChangePercent}%)
              </>
            ) : (
              <>
                {formatMoney(stockInfo.regularMarketChange)} (
                {stockInfo.regularMarketChangePercent})%
              </>
            )}
          </p>
        </div>
        <div
          className={
            "my-1 mx-1 w-full max-w-80 min-w-fit border border-zinc-950/10 dark:border-white/10 ring-zinc-950/10 dark:ring-white/10 rounded-lg"
          }
        >
          <div className="flex w-full min-w-fit items-center px-2">
            <Avatar
              square
              className="size-6 outline-transparent"
              src={`https://logo.clearbit.com/${stockInfo.website}`}
              alt={stockInfo.website}
            />
            <p className="w-full block font-semibold p-3 truncate">
              {stockInfo.symbol}
            </p>
          </div>
          <Divider />
          <div className="p-3">
            <Text className="block mb-2">
              You currently have{" "}
              {userStock && userStock.quantity === 1
                ? "1 share"
                : userStock && userStock.quantity > 1
                ? `${userStock.quantity} shares`
                : "0 shares"}
            </Text>
            <div className="flex items-center min-w-fit gap-2">
              <Button
                className="flex-1 min-w-fit"
                onClick={() => {
                  setTransactionType("Buy");
                  setDialogIsOpen(true);
                }}
                outline
              >
                Buy Shares
              </Button>
              {userStock && userStock.quantity > 0 && (
                <Button
                  className="flex-1 min-w-fit"
                  onClick={() => {
                    setTransactionType("Sell");
                    setDialogIsOpen(true);
                  }}
                  outline
                >
                  Sell Shares
                </Button>
              )}
              <Dialog open={dialogIsOpen} onClose={resetTransactionForm}>
                <DialogTitle>{transactionType} Shares</DialogTitle>
                <form onSubmit={handleTransaction}>
                  <DialogBody>
                    <Field disabled={transactionLoading}>
                      <Label>
                        Quantity{" "}
                        {quantityInput > 0 && (
                          <>
                            (Total Cost{" "}
                            {formatMoney(
                              stockInfo.currentPrice * quantityInput
                            )}
                            )
                          </>
                        )}
                      </Label>
                      <Input
                        type="number"
                        value={quantityInput}
                        onChange={(e) =>
                          setQuantityInput(
                            isNaN(e.target.valueAsNumber)
                              ? 0
                              : e.target.valueAsNumber
                          )
                        }
                        invalid={quantityError ? true : false}
                        autoFocus
                      />
                      {quantityError && (
                        <ErrorMessage>{quantityError}</ErrorMessage>
                      )}
                    </Field>
                  </DialogBody>
                  <DialogActions>
                    <Button
                      plain
                      disabled={transactionLoading}
                      onClick={() => resetTransactionForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      loading={transactionLoading}
                      type={"submit"}
                      disabled={transactionLoading}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-h-32 mt-5">
        {chartOptions && (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"stockChart"}
            options={chartOptions}
          />
        )}
      </div>
      <div className="w-full bg-red mt-10">
        <p className="text-xl font-semibold">About</p>
        <Divider className="my-3" />
        <Text>
          <TextTruncateToggle text={stockInfo.longBusinessSummary || " "} />
        </Text>
        {/* <div className="my-3 flex flex-wrap">
          <div>
            <p></p>
            <Text></Text>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div> */}
      </div>
    </div>
  );
}
