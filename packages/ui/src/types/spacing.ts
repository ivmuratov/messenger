import type { Scale } from "./scale";

export interface MarginProps {
  ml?: Scale;
  mr?: Scale;
  mt?: Scale;
  mb?: Scale;
  mx?: Scale;
  my?: Scale;
  m?: Scale;
}

export interface PaddingProps {
  pl?: Scale;
  pr?: Scale;
  pt?: Scale;
  pb?: Scale;
  px?: Scale;
  py?: Scale;
  p?: Scale;
}

export interface GapProps {
  gap?: Scale;
}

export type SpacingProps = MarginProps & PaddingProps & GapProps;
