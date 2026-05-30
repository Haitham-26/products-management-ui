import type React from "react";
import { Modal, type ModalProps } from "./Modal";
import styled from "styled-components";
import { Icon } from "./Icon";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { Button } from "./Button";

const Container = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.error}1A;
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing.lg};

  svg {
    color: ${({ theme }) => theme.colors.error};
  }
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

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

type WarningModalProps = ModalProps & {
  description?: string | React.ReactNode;
  onClose: VoidFunction;
  onConfirm?: VoidFunction;
  confirmText?: string;
  cancelText?: string;
};

export const WarningModal: React.FC<WarningModalProps> = ({
  open = false,
  title = "Are you sure?",
  description = "Are you sure you want to do this? Once you confirm, you cannot undo it later.",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmLoading = false,
  ...props
}) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} {...props}>
      <Container>
        <IconWrapper>
          <Icon icon={faTriangleExclamation} size="2x" />
        </IconWrapper>

        <Title>{title}</Title>

        <Description>{description}</Description>

        <Actions>
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={confirmLoading}>
            {confirmText}
          </Button>
        </Actions>
      </Container>
    </Modal>
  );
};
