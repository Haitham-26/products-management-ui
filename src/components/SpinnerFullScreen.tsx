import type React from "react";
import { Spinner } from "./Spinner";
import styled from "styled-components";

const Container = styled.div`
  flex-grow: 1;
  align-content: center;

  & > div {
    margin: auto;
  }
`;

export const SpinnerFullScreen: React.FC = () => {
  return (
    <Container>
      <Spinner />
    </Container>
  );
};
