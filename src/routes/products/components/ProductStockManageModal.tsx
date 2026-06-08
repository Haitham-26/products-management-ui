import type React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "../../../components/Modal";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons/faBoxesStacked";
import type { Product } from "../../../model/product/types/Product";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Toast } from "../../../utils/Toast";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { productActions } from "../../../redux/product/products.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { useSearchParams } from "react-router-dom";
import { buildProductsParams } from "../utils/productUtils";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary}0D;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StockBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  min-width: 80px;
`;

const ModeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModeButton = styled(Button)<{
  variant: "add" | "remove";
  active?: boolean;
}>`
  border: 1px solid
    ${({ theme, active, variant }) =>
      active
        ? variant === "add"
          ? theme.colors.success
          : theme.colors.error
        : theme.colors.border};

  background: ${({ theme, active, variant }) =>
    active
      ? variant === "add"
        ? `${theme.colors.success}15`
        : `${theme.colors.error}15`
      : theme.colors.surface};

  color: ${({ theme, active, variant }) =>
    active
      ? variant === "add"
        ? theme.colors.success
        : theme.colors.error
      : theme.colors.textSecondary};

  &:hover {
    border-color: ${({ theme, variant }) =>
      variant === "add" ? theme.colors.success : theme.colors.error};
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NumericControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  height: 48px;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AdjustButton = styled(Button)`
  width: 3rem;
  height: 100%;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border}50;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StockInput = styled(Input)`
  flex: 1;
  height: 100%;
  border-color: transparent !important;
  text-align: center;
  font-size: 1.15rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  box-shadow: none !important;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PreviewSummary = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.border}20;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type ProductStockManageModalProps = {
  open: boolean;
  onClose: VoidFunction;
  product: Product | null;
  filters: Partial<GetProductsDto>;
};

export const ProductStockManageModal: React.FC<
  ProductStockManageModalProps
> = ({ open = false, onClose, product, filters }) => {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const currentStock = product?.quantity || 0;

  const calculatedChange = mode === "add" ? quantity : -quantity;
  const previewStock = Math.max(0, currentStock + calculatedChange);

  const onSetMode = (newMode: "add" | "remove") => {
    setMode(newMode);
    setQuantity(0);
  };

  const handleIncrement = () => {
    setQuantity((prev) => {
      if (mode === "remove" && prev >= currentStock) {
        return currentStock;
      }
      return prev + 1;
    });
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setQuantity(0);
      return;
    }

    let safeVal = Math.max(0, value);

    if (mode === "remove" && safeVal > currentStock) {
      safeVal = currentStock;
    }

    setQuantity(safeVal);
  };

  const handleSubmit = async () => {
    if (!quantity || !product) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        productActions.manageProductStock({
          productId: product._id,
          stockChange: Number(calculatedChange),
          userId,
        }),
      ).unwrap();

      setSearchParams(buildProductsParams(filters, searchParams), {
        replace: true,
      });

      onClose();
    } catch (e) {
      console.error(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setMode("add");
      setQuantity(0);
    }
  }, [open, product?._id]);

  useEffect(() => {
    if (mode === "remove" && quantity > currentStock) {
      setQuantity(currentStock);
    }
  }, [mode, currentStock, quantity]);

  if (!product) {
    return null;
  }

  return (
    <Modal title="Manage Stock Levels" open={open} onCancel={onClose}>
      <Container>
        <InfoBanner>
          <ProductDetails>
            <Text fontWeight="600">{product.name}</Text>
            <Text fontSize="small" color="textSecondary">
              SKU / Base Reference Context
            </Text>
          </ProductDetails>
          <StockBadge>
            <Text fontSize="small" color="textSecondary">
              Current
            </Text>
            <Text fontSize="title" fontWeight="700">
              {currentStock}
            </Text>
          </StockBadge>
        </InfoBanner>

        <ModeSelector>
          <ModeButton
            type="button"
            active={mode === "add"}
            variant="add"
            onClick={() => onSetMode("add")}
          >
            <Icon icon={faPlus} />
            Increase Stock
          </ModeButton>
          <ModeButton
            type="button"
            active={mode === "remove"}
            variant="remove"
            onClick={() => onSetMode("remove")}
          >
            <Icon icon={faMinus} />
            Decrease Stock
          </ModeButton>
        </ModeSelector>

        <InputWrapper>
          <Text fontSize="small" color="textSecondary" fontWeight="600">
            Quantity to {mode === "add" ? "add to" : "deduct from"} inventory
          </Text>

          <NumericControl>
            <AdjustButton
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 0}
            >
              <Icon icon={faMinus} />
            </AdjustButton>

            <StockInput
              type="number"
              value={quantity === 0 ? "" : quantity}
              placeholder="0"
              onChange={handleInputChange}
              min="0"
              max={mode === "remove" ? currentStock : undefined}
            />

            <AdjustButton
              type="button"
              onClick={handleIncrement}
              disabled={mode === "remove" && quantity >= currentStock}
            >
              <Icon icon={faPlus} />
            </AdjustButton>
          </NumericControl>
        </InputWrapper>

        {quantity ? (
          <PreviewSummary>
            <Text fontSize="small" color="textSecondary">
              <Icon icon={faBoxesStacked} /> New inventory estimation:
            </Text>
            <Text fontWeight="700" color={mode === "add" ? "success" : "error"}>
              {currentStock} → {previewStock} units
            </Text>
          </PreviewSummary>
        ) : null}

        <Button onClick={handleSubmit} loading={loading}>
          Apply Changes
        </Button>
      </Container>
    </Modal>
  );
};
