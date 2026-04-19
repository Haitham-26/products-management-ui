import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons/faAlignLeft";
import type { Order } from "../../../model/order/types/Order";
import { useAppSelector } from "../../../redux/store";
import productSliceSelectors from "../../../redux/product/products.selector";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Hero = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeroIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary}1a;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type Props = {
  open: boolean;
  onClose: VoidFunction;
  order: Order | null;
};

export const OrderReadDrawer: React.FC<Props> = ({
  open = false,
  onClose,
  order,
}) => {
  const products = useAppSelector(productSliceSelectors.selectProducts);

  if (!order) {
    return null;
  }

  return (
    <Drawer open={open} onClose={onClose} title="Order details" size="large">
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faCartShopping} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">Order #{order._id}</Text>
            <Text fontSize="small" color="textSecondary">
              Status: {order.status}
            </Text>
          </HeroText>
        </Hero>

        <Card>
          <Text fontSize="subtitle">Items</Text>

          {order.items.map((item, index) => {
            const productName = products.find(
              (product) => product._id === item.productId,
            )?.name;

            return (
              <Row key={index}>
                <Text>{productName || item.productId}</Text>

                <Text>x{item.quantity}</Text>
              </Row>
            );
          })}
        </Card>

        <Card>
          <Row>
            <Icon icon={faAlignLeft} />
            <div>
              <Text fontSize="subtitle" color="textSecondary">
                Note
              </Text>
              <Text>{order.note || "No note provided"}</Text>
            </div>
          </Row>
        </Card>
      </Content>
    </Drawer>
  );
};
