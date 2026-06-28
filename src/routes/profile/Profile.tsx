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
import { Tooltip } from "antd";
import { Text } from "../../components/Text";
import { Breakpoints } from "../../theme/Breakpoints";

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

const AvatarWrapper = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Avatar = styled.div`
  width: 8rem;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radius.full};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    #6366f1 100%
  );
  color: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${({ theme }) => theme.typography.title} * 1.5);
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
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
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);

      const dto = getValues();

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
          <AvatarWrapper>
            <Avatar>{user.name?.charAt(0)?.toUpperCase() || "U"}</Avatar>
          </AvatarWrapper>
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

          <Tooltip title="Coming soon...">
            <Button disabled variant="secondary" style={{ width: "100%" }}>
              Change Avatar
            </Button>
          </Tooltip>
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
