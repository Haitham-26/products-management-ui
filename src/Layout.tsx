import type React from "react";
import { Header } from "./components/Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Fragment } from "react";
import styled from "styled-components";
import { SideMenu } from "./components/SideMenu";

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-inline: calc(${({ theme }) => theme.spacing.lg} * 1.5);

  & > div:nth-child(2) {
    width: 100%;
  }
`;

export const Layout: React.FC = () => {
  return (
    <Fragment>
      <Header />

      <Container>
        <SideMenu />

        <Outlet />
      </Container>

      <ScrollRestoration />
    </Fragment>
  );
};
