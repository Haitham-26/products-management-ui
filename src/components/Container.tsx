import type React from "react";
import styled from "styled-components";
import { Breakpoints } from "../theme/Breakpoints";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme: { spacing } }) => `${spacing.sm} ${spacing.md}`};
  border: ${({ theme }) => `1px solid ${theme.colors.glassBorder}`};

  @media (min-width: ${Breakpoints.MD}) {
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme: { spacing } }) => `${spacing.md} ${spacing.lg}`};
    box-shadow: ${({ theme }) => theme.shadow.md};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    background: ${({ theme }) => theme.colors.glassBackground};
  }
`;

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return <StyledContainer className={className}>{children}</StyledContainer>;
};
