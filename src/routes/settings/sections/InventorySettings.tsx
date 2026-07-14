import type React from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import type { UpdateSettingsDto } from "../../../model/settings/dto/UpdateSettingsDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { Fragment, useEffect, useState } from "react";
import { settingsActions } from "../../../redux/settings/settings.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Toast } from "../../../utils/Toast";
import { SettingsSection } from "../components/SettingsSection";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { Info } from "../../../components/Info";

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
  const { t } = useTranslation();
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
      await dispatch(settingsActions.getSettings()).unwrap();

      Toast.success(t("settings.update.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    dispatch(settingsActions.getSettings());
  }, [dispatch, userId]);

  return (
    <SettingsSection
      title={t("settings.pages.inventory.threshold.title")}
      description={t("settings.pages.inventory.threshold.description")}
      content={
        <Fragment>
          <Info>{t("settings.pages.inventory.threshold.info")}</Info>

          <Controller
            name="inventory.defaultMinStock"
            control={control}
            rules={{
              required: t("errors.general.required"),
              min: {
                value: 1,
                message: t(
                  "settings.pages.inventory.threshold.errors.minStock.min",
                  { min: 1 },
                ),
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Tooltip
                title={
                  isMember ? t("settings.shared.orgOnlyTooltip") : undefined
                }
              >
                <Input
                  value={value}
                  onChange={(e) => onChange(Number(e.currentTarget.value))}
                  type="number"
                  min={1}
                  title={t("settings.pages.inventory.threshold.inputTitle")}
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
              {t("common.save")}
            </StyledButton>
          ) : null}
        </Fragment>
      }
    />
  );
};
