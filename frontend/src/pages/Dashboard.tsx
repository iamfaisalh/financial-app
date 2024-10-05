import { Text } from "../components/Text";

export default function Dashboard() {
  return (
    <div>
      <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
        <div className="relative lg:row-span-2">
          <div className="absolute inset-px rounded-lg lg:rounded-l-[2rem]"></div>
          <div className="relative  flex h-full flex-col overflow-y-auto rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
            <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
              <p className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
                {/* Section Title */}
              </p>
              <Text className="mt-2 max-w-lg text-sm/6 max-lg:text-center">
                {/* Section Description */}
              </Text>
            </div>
            <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
              {/* Section Content */}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-zinc-950/5 dark:ring-white/10 lg:rounded-l-[2rem]"></div>
        </div>
        <div className="relative max-lg:row-start-1">
          <div className="absolute inset-px rounded-lg max-lg:rounded-t-[2rem]"></div>
          <div className="relative flex h-full flex-col rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
              <p className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
                {/* Section Title */}
              </p>
              <Text className="mt-2 max-w-lg text-sm/6 max-lg:text-center">
                {/* Section Description */}
              </Text>
            </div>
            <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
              {/* Section Content */}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-zinc-950/5 dark:ring-white/10 max-lg:rounded-t-[2rem]"></div>
        </div>
        <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
          <div className="absolute inset-px rounded-lg"></div>
          <div className="relative flex h-full flex-col rounded-[calc(theme(borderRadius.lg)+1px)]">
            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
              <p className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
                {/* Section Title */}
              </p>
              <Text className="mt-2 max-w-lg text-sm/6 max-lg:text-center">
                {/* Section Description */}
              </Text>
            </div>
            <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
              {/* Section Content */}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-zinc-950/5 dark:ring-white/10"></div>
        </div>
        <div className="relative lg:row-span-2">
          {/* <div className="absolute inset-px rounded-lg max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div> */}
          <div className="relative flex h-full flex-col overflow-y-auto rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
            <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
              <p className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
                {/* Section Title */}
              </p>
              <Text className="mt-2 max-w-lg text-sm/6 max-lg:text-center">
                {/* Section Description */}
              </Text>
            </div>
            <div className="relative min-h-[30rem] w-full grow">
              {/* Section Content */}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px  shadow ring-1 ring-zinc-950/5 dark:ring-white/10 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
        </div>
      </div>
    </div>
  );
}
