import type React from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "../../../components/Icon";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
import type { UpdateSettingsDto } from "../../../model/settings/dto/UpdateSettingsDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { useEffect, useState } from "react";
import { settingsActions } from "../../../redux/settings/settings.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Toast } from "../../../utils/Toast";

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary}1a;
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary}10;
  border: 1px solid ${({ theme }) => theme.colors.primary}25;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  line-height: 1.6;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const InventorySettings: React.FC = () => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const dispatch = useAppDispatch();
  const { control, handleSubmit, getValues } = useForm<UpdateSettingsDto>({
    defaultValues: {
      userId,
      inventory: {
        defaultMinStock: settings?.inventory?.defaultMinStock || 10,
      },
    },
  });

  const onUpdate = async () => {
    try {
      setUpdateLoading(true);

      await dispatch(settingsActions.updateSettings(getValues())).unwrap();
      await dispatch(settingsActions.getSettings({ userId }));

      Toast.success("Settings updated successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    dispatch(settingsActions.getSettings({ userId }));
  }, [dispatch, userId]);

  return (
    <Section>
      <Header>
        <h3>Inventory Threshold</h3>

        <p>
          Configure the default minimum stock level used to trigger low stock
          alerts across your inventory.
        </p>
      </Header>

      <Alert>
        <Icon icon={faCircleInfo} />

        <span>
          Products without a custom minimum stock value will use this threshold
          automatically.
        </span>
      </Alert>

      <Controller
        name="inventory.defaultMinStock"
        control={control}
        rules={{
          required: "Default minimum stock is required.",
          min: {
            value: 1,
            message: "Default minimum stock must be at least 1.",
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            value={value}
            onChange={(e) => onChange(Number(e.currentTarget.value))}
            type="number"
            min={1}
            title="Default Minimum Stock"
            placeholder="Ex: 10"
            required
            errorMessage={error?.message}
          />
        )}
      />

      <Footer>
        <Button onClick={handleSubmit(onUpdate)} loading={updateLoading}>
          Save Changes
        </Button>
      </Footer>
    </Section>
  );
};
