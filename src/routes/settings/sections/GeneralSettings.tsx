import type React from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import type { UpdateSettingsDto } from "../../../model/settings/dto/UpdateSettingsDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { useEffect, useState } from "react";
import { settingsActions } from "../../../redux/settings/settings.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Toast } from "../../../utils/Toast";
import { Select } from "../../../components/Select";
import { CURRENCY_OPTIONS } from "../../../utils/String";

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

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const GeneralSettings: React.FC = () => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

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
        <h3>Currency</h3>

        <p>
          Select the currency that will be used to display prices and values.
          The currency will be used for all prices and values in the
          application.
        </p>
      </Header>

      <Controller
        name="currency"
        control={control}
        rules={{
          required: "Currency is required.",
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
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
