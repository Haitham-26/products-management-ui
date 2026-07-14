import type React from "react";
import { styled } from "styled-components";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Controller, useForm } from "react-hook-form";
import type { UpdateUserDto } from "../../model/user/dto/UpdateUserDto";
import userSliceSelectors from "../../redux/user/user.selector";
import { userActions } from "../../redux/user/user.slice";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Breakpoints } from "../../theme/Breakpoints";
import { UserAvatar } from "../../components/UserAvatar";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { ImageUpload } from "../../components/ImageUpload";
import isArray from "lodash/isArray";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import type { ThemeType } from "../../theme/theme";
import { Tooltip } from "antd";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 30;
const COMPANY_MAX_LENGTH = 50;

const StyledButton = styled(Button)`
  width: fit-content;
  margin-inline-start: auto;
`;

const StyledInput = styled(Input)`
  cursor: not-allowed;
  opacity: 0.5;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 20rem 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${Breakpoints.LG}) {
    grid-template-columns: 1fr;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AvatarActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AvatarActionButton = styled(Button)<{
  color?: keyof ThemeType["colors"];
}>`
  height: 2.5rem;
  width: 2.5rem;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.full} !important;
  color: ${({ theme, color }) => theme.colors[color || "textPrimary"]};
`;

const StyledImageUpload = styled(ImageUpload)`
  .ant-upload-wrapper,
  .ant-upload-list,
  .ant-upload {
    height: fit-content !important;
    width: fit-content !important;
    border-radius: ${({ theme }) => theme.radius.full} !important;
  }

  .ant-upload {
    background: none !important;
  }

  .ant-upload:hover {
    border-color: ${({ theme }) => theme.colors.border} !important;
  }
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  height: 100%;
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

const UserInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  p:nth-child(2) {
    font-weight: 600;
    margin-top: ${({ theme }) => theme.spacing.xs};
  }

  p:nth-child(3) {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormSectionTitle = styled(Text)`
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(userSliceSelectors.selectUser);
  const isOrgMember = useAppSelector(userSliceSelectors.selectIsOrgMember);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { control, handleSubmit, getValues } = useForm<UpdateUserDto>({
    defaultValues: {
      name: user.name || "",
      userId: user._id,
      company: user?.company || "",
      avatar: user.avatar || "",
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      dto.avatar =
        isArray(dto.avatar) && dto.avatar?.[0]?.originFileObj
          ? dto.avatar[0].originFileObj
          : dto.avatar;

      await dispatch(userActions.updateUser(dto)).unwrap();
      await dispatch(userActions.getUserById()).unwrap();

      Toast.success(t("profile.updateSuccess"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(userActions.getUserById());
  }, [dispatch, user._id]);

  return (
    <Container>
      <PageHeader
        icon={appRoutes.profile.icon}
        title={t(appRoutes.profile.titleKey)}
      />

      <ProfileGrid>
        <SidebarCard>
          <Controller
            control={control}
            name="avatar"
            render={({ field: { value, onChange } }) => (
              <AvatarContainer>
                <UserAvatar
                  user={{ ...user, avatar: isArray(value) ? value[0] : value }}
                  width={"8rem"}
                />

                <AvatarActionsWrapper>
                  <Tooltip title={t("profile.avatar.remove")}>
                    <AvatarActionButton
                      variant="ghost"
                      icon={faTrash}
                      onClick={() => onChange(null)}
                      color="error"
                      disabled={isArray(value) ? !value.length : !value}
                    />
                  </Tooltip>

                  <Tooltip title={t("profile.avatar.edit")}>
                    <StyledImageUpload
                      maxCount={1}
                      onChange={onChange}
                      showUploadList={false}
                    >
                      <AvatarActionButton variant="ghost" icon={faEdit} />
                    </StyledImageUpload>
                  </Tooltip>
                </AvatarActionsWrapper>
              </AvatarContainer>
            )}
          />

          <UserInfo>
            <Text fontWeight={"bold"}>{user.name}</Text>
            {user?.company && !isOrgMember ? (
              <Text fontSize="small" color="primary">
                {user.company}
              </Text>
            ) : null}
            <Text fontSize="small" color="textSecondary">
              {user.email}
            </Text>
          </UserInfo>
        </SidebarCard>

        <FormCard>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormSectionTitle>
              {t("profile.personalInfo.title")}
            </FormSectionTitle>

            <Controller
              control={control}
              name="name"
              rules={{
                required: t("errors.general.required"),
                minLength: {
                  value: NAME_MIN_LENGTH,
                  message: t("errors.general.short", {
                    length: NAME_MIN_LENGTH,
                  }),
                },
                maxLength: {
                  value: NAME_MAX_LENGTH,
                  message: t("errors.general.long", {
                    length: NAME_MAX_LENGTH,
                  }),
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  title={t("common.name")}
                  {...field}
                  valid={!error}
                  errorMessage={error?.message}
                />
              )}
            />

            <StyledInput
              title={t("common.email")}
              value={user.email}
              type="email"
              readOnly
            />

            {!isOrgMember ? (
              <Fragment>
                <FormSectionTitle>
                  {t("profile.orgInfo.title")}
                </FormSectionTitle>

                <Controller
                  control={control}
                  name="company"
                  rules={{
                    maxLength: {
                      value: COMPANY_MAX_LENGTH,
                      message: t("errors.general.long", {
                        length: COMPANY_MAX_LENGTH,
                      }),
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      title={t("common.company")}
                      {...field}
                      valid={!error}
                      errorMessage={error?.message}
                    />
                  )}
                />
              </Fragment>
            ) : null}

            <StyledButton onClick={handleSubmit(onSubmit)} loading={loading}>
              {t("common.save")}
            </StyledButton>
          </Form>
        </FormCard>
      </ProfileGrid>
    </Container>
  );
};
