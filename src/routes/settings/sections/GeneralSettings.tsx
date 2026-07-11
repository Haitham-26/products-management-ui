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
import { Toast } from "../../../utils/Toast";
import { Select } from "../../../components/Select";
import { CURRENCY_OPTIONS } from "../../../utils/String";
import { SettingsSection } from "../components/SettingsSection";
import { Tooltip } from "antd";

const StyledButton = styled(Button)`
  width: fit-content;
  margin-inline-start: auto;
`;

export const GeneralSettings: React.FC = () => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);
  const isMember = useAppSelector(userSliceSelectors.selectIsOrgMember);

  const dispatch = useAppDispatch();
  const { control, handleSubmit, getValues } = useForm<UpdateSettingsDto>({
    defaultValues: {
      userId,
      currency: settings.currency,
    },
  });

  const onUpdate = async () => {
    try {
      setUpdateLoading(true);

      await dispatch(settingsActions.updateSettings(getValues())).unwrap();
      await dispatch(settingsActions.getSettings()).unwrap();

      Toast.success("Settings updated successfully");
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
      title="Currency"
      description=" Select the currency that will be used to display prices and values. The currency will be used for all prices and values in the application."
      content={
        <Fragment>
          <Controller
            name="currency"
            control={control}
            rules={{
              required: "Currency is required.",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Tooltip
                title={
                  isMember
                    ? "Only the organization owner can change this."
                    : undefined
                }
              >
                <Select
                  title="Select Currency"
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
              Save Changes
            </StyledButton>
          ) : null}
        </Fragment>
      }
    />
  );
};
