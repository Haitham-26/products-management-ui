import type React from "react";
import { Row } from "./Row";
import { Column } from "./Column";
import { Container } from "./Container";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  height: 7rem;
  padding: ${({ theme: { spacing } }) =>
    `${spacing.lg} calc(${spacing.lg} * 1.5)`};
  z-index: 100;
`;

export const Header: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Row justify="space-between" align="middle" gutter={16}>
          <Column>
            <h1>LOGO</h1>
          </Column>

          <Column>
            <Link to={"/settings"}>
              <Icon icon={faGear} size="xl" />
            </Link>
          </Column>
        </Row>
      </Container>
    </Wrapper>
  );
};
