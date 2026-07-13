import type React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

type DrawerExtraHeaderProps = {
  editMode?: boolean;
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
  loading?: boolean;
  confirmDisabled?: boolean;
};

export const DrawerExtraHeader: React.FC<DrawerExtraHeaderProps> = ({
  editMode,
  onConfirm,
  onCancel,
  loading = false,
  confirmDisabled = false,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "common" });

  return (
    <Container>
      <Button variant="ghost" onClick={onCancel}>
        {t("cancel")}
      </Button>

      <Button onClick={onConfirm} loading={loading} disabled={confirmDisabled}>
        {t(editMode ? "edit" : "create")}
      </Button>
    </Container>
  );
};
