import { Button } from "../components/Button";
import Content from "../components/Content";
import { Text } from "../components/Text";

export default function NotFound() {
  return (
    <Content className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="block text-base font-semibold text-green-500">404</p>
        <p className="block mt-4 font-bold text-3xl tracking-tight sm:text-5xl text-zinc-950 dark:text-white">
          Page not found
        </p>
        <Text className="block mt-6 lg:text-base leading-7">
          Sorry, we couldn't find the page you're looking for.
        </Text>
        <Button color="green" className="mt-10 block" to="/">
          Go back home
        </Button>
      </div>
    </Content>
  );
}
