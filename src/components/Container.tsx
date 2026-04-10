import type React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme: { spacing } }) => `${spacing.md} ${spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.md};
  border: ${({ theme }) => `1px solid ${theme.colors.glassBorder}`};
  background: ${({ theme }) => theme.colors.glassBackground};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  box-shadow: ${({ theme }) => theme.shadow.md};
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
