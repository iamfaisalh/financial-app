import { Button } from "../components/Button";
import { Text } from "../components/Text";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <p className="block text-4xl font-bold tracking-tight sm:text-6xl text-zinc-950 dark:text-white">
          Make smart investments
        </p>
        <Text className="block mt-6 sm:text-lg lg:text-lg leading-8">
          Look up your favorite stocks and start investing today. Buy and sell
          strategically to make the most out of your investment and earn big!
          View and manage your purchased stocks in your portfolio.
        </Text>
        <Button to={"/signup"} color="green" className="mt-10 block">
          Get Started Today!
        </Button>
      </div>
    </div>
  );
}
