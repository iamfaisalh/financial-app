import clsx from "clsx";

export default function Content({
  className,
  children,
}: {
  className?: string;
  children: any;
}) {
  return (
    <div
      className={clsx(
        className,
        "bg-white dark:bg-zinc-900  text-zinc-950 dark:text-white"
      )}
    >
      {children}
    </div>
  );
}
