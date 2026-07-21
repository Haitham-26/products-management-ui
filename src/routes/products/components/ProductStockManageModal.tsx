import type React from "react";
import { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { Modal } from "../../../components/Modal";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import type { Product } from "../../../model/product/types/Product";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { productActions } from "../../../redux/product/products.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { useSearchParams } from "react-router-dom";
import { buildProductsParams } from "../utils/productUtils";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../../components/toast/useAppToast";
import i18n from "../../../i18n";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { Breakpoints } from "../../../theme/Breakpoints";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 4px 0 0 0;
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}80;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StockMetric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const SegmentedControl = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${({ theme }) => theme.colors.border}40;
  padding: 3px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border}60;
`;

const SegmentButton = styled(Button)<{ $active: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.surface : "transparent"};
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  box-shadow: ${({ $active }) =>
    $active
      ? "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.025)"
      : "none"};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const NumericSelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  width: 100%;
  max-width: 16rem;
  height: 40px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}15;
  }

  @media (max-width: ${Breakpoints.MD}) {
    max-width: 100%;
  }
`;

const AdjustButton = styled(Button)`
  width: 3rem;
  padding: 0;
  height: 100%;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StockInput = styled(Input)`
  border: none !important;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: none !important;
  padding: 0;

  &::placeholder {
    text-align: center !important;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
  appearance: textfield;
`;

const LivePreviewRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 1.5rem;
  margin-top: 4px;

  svg {
    opacity: 0.4;
  }
`;

const PreviewState = styled.span`
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};

  &.empty-state {
    opacity: 0.6;
  }
`;

const PreviewResult = styled.span<{ $mode: "add" | "remove" }>`
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: ${({ theme, $mode }) =>
    $mode === "add" ? theme.colors.success : theme.colors.error};
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

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

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

      Toast.success(t("products.manageStock.success"));
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
    <Modal
      title={t("products.manageStock.title")}
      open={open}
      onCancel={onClose}
    >
      <Container>
        <ProductHeader>
          <ProductMeta>
            <Text fontSize="small" color="textSecondary">
              {t("common.product")}
            </Text>
            <Text fontWeight="600" color="textPrimary">
              {product.name}
            </Text>
          </ProductMeta>

          <StockMetric>
            <Text fontSize="small" color="textSecondary">
              {t("products.read.availableStock")}
            </Text>
            <Text fontSize="title" fontWeight="600">
              {currentStock}
            </Text>
          </StockMetric>
        </ProductHeader>

        <SegmentedControl>
          <SegmentButton
            $active={mode === "add"}
            onClick={() => onSetMode("add")}
            icon={faPlus}
          >
            {t("common.increase")}
          </SegmentButton>
          <SegmentButton
            $active={mode === "remove"}
            onClick={() => onSetMode("remove")}
            icon={faMinus}
          >
            {t("common.decrease")}
          </SegmentButton>
        </SegmentedControl>

        <ControlSection>
          <NumericSelector>
            <AdjustButton
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 0}
              icon={faMinus}
            />

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
              icon={faPlus}
            />
          </NumericSelector>

          <LivePreviewRow>
            {quantity > 0 ? (
              <Fragment>
                <PreviewState>{currentStock}</PreviewState>
                <Icon
                  icon={
                    i18n.dir(i18n.language) === "rtl"
                      ? faArrowLeft
                      : faArrowRight
                  }
                />
                <PreviewResult $mode={mode}>{previewStock}</PreviewResult>
              </Fragment>
            ) : (
              <PreviewState className="empty-state">
                {t("products.manageStock.empty")}
              </PreviewState>
            )}
          </LivePreviewRow>
        </ControlSection>

        <Button onClick={handleSubmit} loading={loading} disabled={!quantity}>
          {t("common.update")}
        </Button>
      </Container>
    </Modal>
  );
};
