import type React from "react";
import styled, { css, keyframes } from "styled-components";
import type { ThemeType } from "../theme/theme";

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div<{ color?: SpinnerProps["color"] }>`
  height: 2rem;
  width: 2rem;
  border: 3px solid ${({ color, theme }) => theme.colors[color || "primary"]};
  border-top-color: ${({ color, theme }) => theme.colors[color || "primary"]}10;
  border-radius: 50%;
  ${css`
    animation: ${spinAnimation} 2s linear infinite;
  `}
`;

type SpinnerProps = {
  color?: keyof ThemeType["colors"];
  className?: string;
};

export const Spinner: React.FC<SpinnerProps> = (props) => {
  return <Container {...props} />;
};
