import type React from "react";
import { Images } from "../assets";
import { Image } from "./Image";
import styled from "styled-components";
import { Text } from "./Text";

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Brand = styled.div`
  margin: 0 auto;
  max-width: 6rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Header = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Footer = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.small};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

type AuthContainerProps = {
  title: string;
  description: string | React.ReactNode;
  formItems: React.ReactNode[];
  footerContent?: React.ReactNode;
};

export const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  description,
  formItems = [],
  footerContent,
}) => {
  return (
    <Card>
      <Header>
        <Brand>
          <Image src={Images.Logo} alt="Inventix" />
        </Brand>

        <Text fontWeight="bold" fontSize="title">
          {title}
        </Text>
        <Text color="textSecondary">{description}</Text>
      </Header>

      <Form>{formItems.map((item) => item)}</Form>

      {footerContent ? <Footer>{footerContent}</Footer> : null}
    </Card>
  );
};
