import clsx from "clsx";
import React from "react";

interface BannerAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "Success" | "Error" | "Warning" | "Info" | "Neutral";
  isClosable?: boolean;
  onClose?: any;
  message: string;
}

export default React.forwardRef<HTMLElement, BannerAlertProps>(
  function BannerAlert(
    {
      variant = "Neutral",
      message,
      className,
      isClosable = false,
      onClose,
      ...otherProps
    }: BannerAlertProps,
    ref
  ) {
    return (
      <div
        ref={ref as any}
        className={clsx(
          className,
          "flex items-center p-4 text-sm border rounded-lg mb-2",
          {
            "text-gray-300 border-gray-600": variant === "Neutral",
            "text-yellow-300 border-yellow-800": variant === "Warning",
            "text-blue-400 border-blue-800": variant === "Info",
            "text-green-400 border-green-800": variant === "Success",
            "text-red-400 border-red-800": variant === "Error",
          }
        )}
        role="alert"
        {...otherProps}
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>{message}</div>
        {isClosable ? (
          <button
            type="button"
            className={clsx(
              "ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-brand-gray",
              {
                "text-gray-300 focus:ring-gray-400 hover:text-white":
                  variant === "Neutral",
                "text-yellow-300 focus:ring-yellow-400": variant === "Warning",
                "text-blue-400 focus:ring-blue-400": variant === "Info",
                "text-green-400 focus:ring-green-400": variant === "Success",
                "text-red-400 focus:ring-red-400": variant === "Error",
              }
            )}
            aria-label="Close"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        ) : null}
      </div>
    );
  }
);
