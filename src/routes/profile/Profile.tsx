import type React from "react";
import { styled } from "styled-components";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Controller, useForm } from "react-hook-form";
import type { UpdateUserDto } from "../../model/user/dto/UpdateUserDto";
import userSliceSelectors from "../../redux/user/user.selector";
import { userActions } from "../../redux/user/user.slice";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Toast } from "../../utils/Toast";
import { Text } from "../../components/Text";
import { Breakpoints } from "../../theme/Breakpoints";
import { UserAvatar } from "../../components/UserAvatar";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { ImageUpload } from "../../components/ImageUpload";
import { isArray } from "lodash";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import type { ThemeType } from "../../theme/theme";
import { Tooltip } from "antd";

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
  const dispatch = useAppDispatch();

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
      await dispatch(userActions.getUserById({ userId: user._id })).unwrap();

      Toast.success("Your profile updated successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(userActions.getUserById({ userId: user._id }));
  }, [dispatch, user._id]);

  return (
    <Container>
      <PageHeader icon={faUser} title="Profile Settings" />

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
                  <Tooltip title="Remove avatar">
                    <AvatarActionButton
                      variant="ghost"
                      icon={faTrash}
                      onClick={() => onChange(null)}
                      color="error"
                      disabled={isArray(value) ? !value.length : !value}
                    />
                  </Tooltip>

                  <Tooltip title="Change avatar">
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
            <FormSectionTitle>Personal Information</FormSectionTitle>

            <Controller
              control={control}
              name="name"
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Full name must be at most 30 characters",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  title="Full Name"
                  placeholder="Enter your name"
                  {...field}
                  valid={!error}
                  errorMessage={error?.message}
                />
              )}
            />

            <StyledInput title="Email Address" value={user.email} readOnly />

            {!isOrgMember ? (
              <Fragment>
                <FormSectionTitle>Organization Information</FormSectionTitle>

                <Controller
                  control={control}
                  name="company"
                  rules={{
                    maxLength: {
                      value: 50,
                      message: "Company name must be at most 50 characters",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      title="Company Name"
                      placeholder="Enter your organization or company name"
                      {...field}
                      valid={!error}
                      errorMessage={error?.message}
                    />
                  )}
                />
              </Fragment>
            ) : null}

            <StyledButton onClick={handleSubmit(onSubmit)} loading={loading}>
              Save Changes
            </StyledButton>
          </Form>
        </FormCard>
      </ProfileGrid>
    </Container>
  );
};
