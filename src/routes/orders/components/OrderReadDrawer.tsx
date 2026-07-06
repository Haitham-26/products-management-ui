import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons/faAlignLeft";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import type { Order } from "../../../model/order/types/Order";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { ProductMainImage } from "../../products/components/ProductMainImage";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const GlassHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary}0D;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.typography.title};
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.small};
  }
`;

const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.glassBackground};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  h4 {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const OrderLineItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderLineItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ValueText = styled.span`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PriceColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ItemTotal = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DiscountBadge = styled.span`
  font-size: 0.7rem;
  background: ${({ theme }) => theme.colors.error}15;
  color: ${({ theme }) => theme.colors.error};
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  margin-top: 2px;
`;

const GrandTotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
`;

const TotalAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const NoteText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
  font-style: italic;
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
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  if (!order) {
    return null;
  }

  const renderDiscount = (item: Order["items"][0]) => {
    if (!item.discountAtPurchase) return null;

    const { type, value } = item.discountAtPurchase;
    const label =
      type === ProductDiscountTypes.PERCENTAGE
        ? `${value}% OFF`
        : `$${value} OFF`;

    return <DiscountBadge>{label}</DiscountBadge>;
  };

  return (
    <Drawer open={open} onClose={onClose} title="Order Overview" size="large">
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faCartShopping} />
          </IconWrapper>
          <TitleGroup>
            <h2>Order #{order.identifier}</h2>
            <span>
              Status: <strong>{order.status}</strong>
            </span>
          </TitleGroup>
        </GlassHeader>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faUser} />
            <h4>Customer Info</h4>
          </SectionLabel>

          <ItemInfo>
            <ItemTitle>{order.customerName}</ItemTitle>

            {order?.customerEmail ? (
              <ValueText>
                <Icon icon={faEnvelope} />
                {order.customerEmail || "No email provided"}
              </ValueText>
            ) : null}

            {order?.customerPhone ? (
              <ValueText>
                <Icon icon={faPhone} />
                {order.customerPhone || "No phone provided"}
              </ValueText>
            ) : null}
          </ItemInfo>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faBoxOpen} />
            <h4>Purchased Items</h4>
          </SectionLabel>

          <OrderLineItemsWrapper>
            {order.items.map((item, index) => (
              <OrderLineItem key={`${item.productId}-${index}`}>
                <ItemInfo>
                  <ItemTitle>
                    <ProductMainImage
                      url={item.productMainImage}
                      width="2rem"
                    />
                    {item.productName}
                  </ItemTitle>
                  <ValueText>
                    {item.quantity} ×
                    {` ${stringWithCurrencyCode(
                      settings.currency,
                      item.priceAtPurchase,
                    )}`}
                  </ValueText>
                  {renderDiscount(item)}
                </ItemInfo>

                <PriceColumn>
                  <ItemTotal>
                    {stringWithCurrencyCode(
                      settings.currency,
                      item.finalPrice * item.quantity,
                    )}
                  </ItemTotal>
                </PriceColumn>
              </OrderLineItem>
            ))}
          </OrderLineItemsWrapper>

          <GrandTotalSection>
            <ItemTitle>Total Amount</ItemTitle>
            <TotalAmount>
              {stringWithCurrencyCode(
                settings.currency,
                order.totalPriceAtPurchase,
              )}
            </TotalAmount>
          </GrandTotalSection>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faAlignLeft} />
            <h4>Order Note</h4>
          </SectionLabel>
          <NoteText>
            {order.note || "No additional notes provided for this transaction."}
          </NoteText>
        </InfoSection>
      </FormContainer>
    </Drawer>
  );
};
