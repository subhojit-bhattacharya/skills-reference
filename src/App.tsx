import { useCallback, useState } from "react";
import VideoBackground from "./components/VideoBackground";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Section from "./components/Section";
import FailureModes from "./components/FailureModes";
import DeepShallow from "./components/DeepShallow";
import Flow from "./components/Flow";
import SkillBrowser from "./components/SkillBrowser";
import Vocabulary from "./components/Vocabulary";
import Books from "./components/Books";
import Footer from "./components/Footer";
import {
  useHeroProgress,
  useMounted,
  useReveal,
  useAwayTitle,
  useConsoleNote,
} from "./hooks";
import { AWAY_TITLE, CONSOLE_NOTE } from "./crab";

export default function App() {
  const mounted = useMounted();
  const progress = useHeroProgress();
  const revealRef = useReveal<HTMLDivElement>();
  const [jumpTo, setJumpTo] = useState<string | null>(null);

  useAwayTitle(AWAY_TITLE);
  useConsoleNote(CONSOLE_NOTE);

  // A chip in the failure-mode cards opens the matching skill card below.
  const handleJump = useCallback((name: string) => {
    setJumpTo(null);
    requestAnimationFrame(() => setJumpTo(name));
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <VideoBackground progress={progress} />
      <Header shown={mounted} />
      <Hero shown={mounted} progress={progress} />

      <div ref={revealRef} className="relative z-20">
        <Section
          id="argument"
          eyebrow="FOUR FAILURE MODES"
          title="Every skill exists to fix something."
          intro="This is not a framework. Each skill answers a specific way that work with an agent goes wrong, and each fix was described in a book long before agents existed. Select any command to open it below."
        >
          <FailureModes onJump={handleJump} />
        </Section>

        <Section
          id="shape"
          eyebrow="THE SHAPE OF A CODEBASE"
          title="Depth is a property of the interface."
          intro="A codebase made of many shallow modules is a field of small blobs. The same code arranged into fewer, deeper modules gives an agent a small number of interfaces to learn. This is the idea the whole collection rests on."
        >
          <DeepShallow />
        </Section>

        <Section
          id="flow"
          eyebrow="IDEA TO SHIPPED"
          title="The route most work travels."
          intro="Steps one to three stay in one unbroken context window, so the interview, the specification, and the tickets all build on the same thinking. Each implementation then starts fresh from its ticket."
        >
          <Flow />
        </Section>

        <Section
          id="skills"
          eyebrow="THE REFERENCE"
          title="Thirty-five skills."
          intro="Each card is a module: a small interface over an implementation you open only when you need it. Press the forward slash key to search."
        >
          <SkillBrowser jumpTo={jumpTo} />
        </Section>

        <Section
          id="vocabulary"
          eyebrow="SHARED LANGUAGE"
          title="The words, used precisely."
          intro="The skills use these terms exactly and expect you to do the same. Substituting near synonyms is the failure this vocabulary exists to prevent."
        >
          <Vocabulary />
        </Section>

        <Section
          id="books"
          eyebrow="WHERE IT COMES FROM"
          title="Seven books, none of them new."
          intro="The argument is assembled from software engineering literature that predates coding agents by decades. That is the point being made."
        >
          <Books />
        </Section>

        <Footer />
      </div>
    </div>
  );
}
