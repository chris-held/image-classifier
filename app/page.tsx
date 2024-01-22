import ImageClassifier from "./ui/imageClassifier";
import { getGreeting } from "./lib/messages";

export default async function Home() {
  const greeting = await getGreeting();
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p className="text-xl pb-8 max-w-4xl italic">
        {greeting.replaceAll(/\"/g, "")}
      </p>
      <ImageClassifier />
    </main>
  );
}
