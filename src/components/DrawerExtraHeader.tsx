import type React from "react";
import styled from "styled-components";
import { Button } from "./Button";

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
  return (
    <Container>
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>

      <Button onClick={onConfirm} loading={loading} disabled={confirmDisabled}>
        {editMode ? "Edit" : "Create"}
      </Button>
    </Container>
  );
};
