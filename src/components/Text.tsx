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

const lineHeights: Record<
  keyof ThemeType["typography"],
  React.CSSProperties["lineHeight"]
> = {
  title: 2,
  subtitle: 1.8,
  body: 1.7,
  small: 1.7,
};

const StyledP = styled.p<StyledTextProps>`
  font-size: ${({ theme, fontSize }) => theme.typography[fontSize || "body"]};
  color: ${({ theme, color }) => theme.colors[color || "textPrimary"]};
  font-weight: ${({ fontSize, fontWeight }) =>
    fontWeight || fontWeights[fontSize || "body"]};
  line-height: ${({ fontSize, lineHeight }) =>
    lineHeight || lineHeights[fontSize || "body"]};
  text-align: ${({ textAlign }) => textAlign};
  font-style: ${({ fontStyle }) => fontStyle};
  word-break: break-word;
`;

type StyledTextProps = {
  fontSize?: TextProps["fontSize"];
  fontWeight?: TextProps["fontWeight"];
  color?: TextProps["color"];
  textAlign?: TextProps["textAlign"];
  fontStyle?: React.CSSProperties["fontStyle"];
  lineHeight?: React.CSSProperties["lineHeight"];
};

type TextProps = {
  fontSize?: keyof ThemeType["typography"];
  fontWeight?: React.CSSProperties["fontWeight"];
  children: React.ReactNode;
  color?: keyof ThemeType["colors"];
  as?: React.ElementType;
  textAlign?: React.CSSProperties["textAlign"];
  fontStyle?: React.CSSProperties["fontStyle"];
  lineHeight?: React.CSSProperties["lineHeight"];
  className?: string;
};

export const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return <StyledP {...props}>{children}</StyledP>;
};
