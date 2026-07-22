import type React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: inherit;
  align-content: center;
  padding-block: ${({ theme }) => theme.spacing.md};
`;

export const PublicLayout: React.FC = () => {
  return (
    <Container>
      <Outlet />
      <ScrollRestoration />
    </Container>
  );
};
