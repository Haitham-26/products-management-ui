import type React from "react";
import type { ThemeType } from "../theme/theme";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import styled from "styled-components";
import { Icon } from "./Icon";

type InfoProps = {
  children: React.ReactNode | string;
  color?: keyof ThemeType["colors"];
  icon?: IconProp;
};

const Container = styled.div<{ color: NonNullable<InfoProps["color"]> }>`
  background-color: ${({ theme, color }) => theme.colors[color]}1a;
  color: ${({ theme, color }) => theme.colors[color]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.small};
`;

export const Info: React.FC<InfoProps> = ({
  children,
  color = "info",
  icon = faInfoCircle,
}) => {
  return (
    <Container color={color}>
      <Icon icon={icon} color={color} />
      {children}
    </Container>
  );
};
