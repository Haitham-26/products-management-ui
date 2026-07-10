import type React from "react";
import { Modal, type ModalProps } from "./Modal";
import styled from "styled-components";
import { Icon } from "./Icon";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { Button } from "./Button";
import isFunction from "lodash/isFunction";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { ThemeType } from "../theme/theme";

const Container = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div<{ variantColor: keyof ThemeType["colors"] }>`
  background-color: ${({ theme, variantColor }) =>
    theme.colors[variantColor]}1A;
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.subtitle};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.5;
  max-width: 320px;
`;

const Actions = styled.div<{ variantColor: keyof ThemeType["colors"] }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  button:nth-child(2) {
    background-color: ${({ variantColor, theme }) =>
      theme.colors[variantColor]};
  }
`;

type WarningModalProps = ModalProps & {
  description?: string | React.ReactNode;
  onClose: VoidFunction;
  onConfirm?: VoidFunction;
  confirmText?: string;
  cancelText?: string;
  cancelLoading?: boolean;
  icon?: IconProp;
  variantColor?: keyof ThemeType["colors"];
};

export const WarningModal: React.FC<WarningModalProps> = ({
  open = false,
  title = "Are you sure?",
  description = "Are you sure you want to do this? Once you confirm, you cannot undo it later.",
  onClose,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmLoading = false,
  cancelLoading = false,
  variantColor = "error",
  icon = faTriangleExclamation,
  ...props
}) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} {...props}>
      <Container>
        <IconWrapper variantColor={variantColor}>
          <Icon icon={icon} size="2x" color={variantColor} />
        </IconWrapper>

        <Title>{title}</Title>

        <Description>{description}</Description>

        <Actions variantColor={variantColor}>
          <Button
            variant="secondary"
            onClick={isFunction(onCancel) ? onCancel : onClose}
            loading={cancelLoading}
          >
            {cancelText}
          </Button>
          <Button onClick={onConfirm} loading={confirmLoading}>
            {confirmText}
          </Button>
        </Actions>
      </Container>
    </Modal>
  );
};
