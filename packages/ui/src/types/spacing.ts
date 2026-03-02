export type SpacingScale = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface MarginProps {
  ml?: SpacingScale;
  mr?: SpacingScale;
  mt?: SpacingScale;
  mb?: SpacingScale;
  mx?: SpacingScale;
  my?: SpacingScale;
  m?: SpacingScale;
}

export interface PaddingProps {
  pl?: SpacingScale;
  pr?: SpacingScale;
  pt?: SpacingScale;
  pb?: SpacingScale;
  px?: SpacingScale;
  py?: SpacingScale;
  p?: SpacingScale;
}

export interface GapProps {
  gap?: SpacingScale;
}

export type SpacingProps = MarginProps & PaddingProps & GapProps;
