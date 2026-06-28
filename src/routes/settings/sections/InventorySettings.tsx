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
import { Fragment, useEffect, useState } from "react";
import { settingsActions } from "../../../redux/settings/settings.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Toast } from "../../../utils/Toast";
import { SettingsSection } from "../components/SettingsSection";
import { Tooltip } from "antd";

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

const StyledButton = styled(Button)`
  width: fit-content;
  margin-inline-start: auto;
`;

export const InventorySettings: React.FC = () => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);
  const isMember = useAppSelector(userSliceSelectors.selectIsOrgMember);

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
    <SettingsSection
      title="Inventory Threshold"
      description="Configure the default minimum stock level used to trigger low stock alerts across your inventory."
      content={
        <Fragment>
          <Alert>
            <Icon icon={faCircleInfo} />

            <span>
              Products without a custom minimum stock value will use this
              threshold automatically.
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
              <Tooltip
                title={
                  isMember
                    ? "Only the organization owner can change this."
                    : undefined
                }
              >
                <Input
                  value={value}
                  onChange={(e) => onChange(Number(e.currentTarget.value))}
                  type="number"
                  min={1}
                  title="Default Minimum Stock"
                  placeholder="Ex: 10"
                  required
                  errorMessage={error?.message}
                  disabled={isMember}
                />
              </Tooltip>
            )}
          />

          {!isMember ? (
            <StyledButton
              onClick={handleSubmit(onUpdate)}
              loading={updateLoading}
            >
              Save Changes
            </StyledButton>
          ) : null}
        </Fragment>
      }
    />
  );
};
