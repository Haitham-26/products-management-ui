import type React from "react";
import { Container } from "../../components/Container";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  flex-grow: 1;
`;

export const Dashboard: React.FC = () => {
  return <StyledContainer>Dashboard</StyledContainer>;
};
