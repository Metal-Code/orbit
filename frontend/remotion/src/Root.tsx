import { Composition } from "remotion";
import { Hero } from "./Hero";

const FPS = 30;
const DURATION = 30 * FPS;

export const RemotionRoot = () => (
  <>
    <Composition
      id="hero-dark"
      component={Hero}
      durationInFrames={DURATION}
      fps={FPS}
      width={1620}
      height={1620}
      defaultProps={{ theme: "dark" as const }}
    />
    <Composition
      id="hero-light"
      component={Hero}
      durationInFrames={DURATION}
      fps={FPS}
      width={1620}
      height={1620}
      defaultProps={{ theme: "light" as const }}
    />
  </>
);
