import type React from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import type { UpdateSettingsDto } from "../../../model/settings/dto/UpdateSettingsDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { Fragment, useEffect, useState } from "react";
import { settingsActions } from "../../../redux/settings/settings.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Select } from "../../../components/Select";
import { CURRENCY_OPTIONS } from "../../../utils/String";
import { SettingsSection } from "../components/SettingsSection";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { AppLangs } from "../../../model/app/types/AppLangs.enum";
import i18n from "../../../i18n";
import { changeLanguage } from "../../../utils/i18nUtils";
import { useAppToast } from "../../../components/toast/useAppToast";

const LANGUAGE_OPTIONS = [
  {
    label: "English",
    value: AppLangs.EN,
  },
  {
    label: "العربية",
    value: AppLangs.AR,
  },
];

const StyledButton = styled(Button)`
  width: fit-content;
  margin-inline-start: auto;
`;

export const GeneralSettings: React.FC = () => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);
  const isMember = useAppSelector(userSliceSelectors.selectIsOrgMember);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { control, handleSubmit, getValues } = useForm<UpdateSettingsDto>({
    defaultValues: {
      userId,
      currency: settings.currency,
      lang: settings.lang,
    },
  });

  const onUpdate = async () => {
    try {
      setUpdateLoading(true);

      const dto = getValues();

      await dispatch(settingsActions.updateSettings(dto)).unwrap();
      await dispatch(settingsActions.getSettings()).unwrap();

      if (dto.lang && i18n.language !== dto.lang) {
        await changeLanguage(dto.lang);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

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
    <Fragment>
      <SettingsSection
        title={t("settings.pages.general.language.title")}
        description={t("settings.pages.general.language.description")}
        content={
          <Controller
            control={control}
            name="lang"
            render={({ field: { value, onChange } }) => (
              <Select
                title={t("settings.pages.general.language.selectTitle")}
                value={value}
                onChange={onChange}
                options={LANGUAGE_OPTIONS}
              />
            )}
          />
        }
      />

      <SettingsSection
        title={t("settings.pages.general.currency.title")}
        description={t("settings.pages.general.currency.description")}
        content={
          <Fragment>
            <Controller
              name="currency"
              control={control}
              rules={{
                required: t("errors.general.required"),
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Tooltip
                  title={
                    isMember ? t("settings.shared.orgOnlyTooltip") : undefined
                  }
                >
                  <Select
                    title={t("settings.pages.general.currency.selectTitle")}
                    required
                    errorMessage={error?.message}
                    value={value}
                    onChange={onChange}
                    options={CURRENCY_OPTIONS}
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label as string)
                          ?.toLowerCase()
                          .includes(input?.toLowerCase()),
                    }}
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
    </Fragment>
  );
};
