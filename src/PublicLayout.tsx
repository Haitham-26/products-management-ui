import type React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  #root {
    height: inherit;
    align-content: center;
  }
`;

const Container = styled.div`
  margin: auto;

  @media (min-width: 768px) {
    max-width: 25rem;
  }
`;

export const PublicLayout: React.FC = () => {
  return (
    <Container>
      <Outlet />
      <ScrollRestoration />
      <GlobalStyle />
    </Container>
  );
};
