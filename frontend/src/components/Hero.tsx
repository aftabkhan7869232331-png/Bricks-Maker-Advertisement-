import { Button } from "./Button";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-violet-400">
        Bricks Maker Advertisement
      </p>
      <h1 className="text-5xl font-black text-white md:text-7xl">
        Build campaigns that move.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
        Create advertising visuals, captions, and AI-powered videos from one workspace.
      </p>
      <Button className="mt-8">Start creating</Button>
    </section>
  );
}
