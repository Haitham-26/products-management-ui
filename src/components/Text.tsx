import type React from "react";
import type { ThemeType } from "../theme/theme";
import styled from "styled-components";

const fontWeights: Record<
  keyof ThemeType["typography"],
  React.CSSProperties["fontWeight"]
> = {
  title: 600,
  subtitle: 500,
  body: 400,
  small: 300,
};

const StyledP = styled.p<StyledTextProps>`
  font-size: ${({ theme, fontSize }) => theme.typography[fontSize || "body"]};
  color: ${({ theme, color }) => theme.colors[color || "textPrimary"]};
  font-weight: ${({ fontSize, fontWeight }) =>
    fontWeight || fontWeights[fontSize || "body"]};
`;

type StyledTextProps = {
  fontSize?: TextProps["fontSize"];
  fontWeight?: TextProps["fontWeight"];
  color?: TextProps["color"];
};

type TextProps = {
  fontSize?: keyof ThemeType["typography"];
  fontWeight?: React.CSSProperties["fontWeight"];
  children: React.ReactNode;
  color?: keyof ThemeType["colors"];
  as?: React.ElementType;
};

export const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return <StyledP {...props}>{children}</StyledP>;
};
