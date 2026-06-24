import React, { type KeyboardEvent, type FocusEvent, useState } from "react";
import styled from "styled-components";
import { Toast } from "../../../utils/Toast";
import { Button } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { Tooltip } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { InviteMembersDto } from "../../../model/user/users-permissions/dto/InviteMembersDto";
import userSliceSelectors from "../../../redux/user/user.selector";
import { REGEXES } from "../../../utils/String";
import { usersPermissionsActions } from "../../../redux/users-permissions/users-permissions.slice";
import { last } from "lodash";

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
`;

const Counter = styled.span<{ isMax: boolean }>`
  color: ${({ theme, isMax }) =>
    isMax ? theme.colors.error : theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.small};
`;

const InfoBox = styled.ul`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  li {
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const InputContainer = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  min-height: 44px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.primary};
  }
`;

const EmailTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 2px ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.textPrimary};
  user-select: none;
`;

const RemoveButton = styled(Button)`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const StyledInput = styled(Input)`
  flex: 1;
  border: none;
  box-shadow: none;
  padding: 0;
  background: transparent;
  min-width: 150px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.body};

  &:focus {
    box-shadow: none;
  }
`;

const HelpText = styled.span`
  font-size: ${({ theme }) =>
    `calc(${theme.typography.small} - (${theme.typography.small}) / 5)`};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: -2px;
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.error};
  margin-top: -2px;
`;

type InviteMembersModalProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const maxEmails = 10;

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<InviteMembersDto & { inputValue: string }>({
    defaultValues: {
      emails: [],
      inputValue: "",
      userId,
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
  });

  const currentEmails = watch("emails") || [];
  const currentInputValue = watch("inputValue") || "";

  const localOnClose = () => {
    reset({
      emails: [],
      inputValue: "",
      userId,
    });
    onClose();
  };

  const addEmail = async (value: string) => {
    const cleanedEmail = value.trim().toLowerCase();

    if (!cleanedEmail) {
      return;
    }

    const isValid = await trigger("inputValue");
    if (!isValid) {
      return;
    }

    append({ content: cleanedEmail });
    setValue("inputValue", "", { shouldValidate: true });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail(currentInputValue);
    } else if (
      e.key === "Backspace" &&
      !currentInputValue &&
      currentEmails.length
    ) {
      const popped = last(currentEmails);
      remove(currentEmails.length - 1);
      if (popped) {
        setValue("inputValue", popped.content, { shouldValidate: true });
      }
    }
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      addEmail(e.target.value);
    }
  };

  const editEmail = (indexToEdit: number) => {
    const emailToEdit = currentEmails[indexToEdit];
    remove(indexToEdit);
    setValue("inputValue", emailToEdit.content);

    const emailInput = document.getElementById("email-input");

    if (emailInput) {
      emailInput.focus();
    }
  };

  const onSubmit = async () => {
    try {
      const { emails, inputValue } = getValues();
      const pendingInput = inputValue.trim().toLowerCase();

      const isValidPendingInput = await trigger("inputValue");

      if (pendingInput) {
        if (
          isValidPendingInput &&
          !emails.map((e) => e.content).includes(pendingInput) &&
          emails.length < maxEmails
        ) {
          append({ content: pendingInput });
        }
      }

      setLoading(true);

      await dispatch(
        usersPermissionsActions.inviteMembers({
          userId,
          // @ts-expect-error the emails type is { content: string }[] just
          // to get the useFieldArray to work
          emails: emails.map((e) => e.content),
        }),
      ).unwrap();
      await dispatch(
        usersPermissionsActions.getOwnerInvitations({ userId }),
      ).unwrap();

      localOnClose();
      Toast.success("Invitations sent successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Invite Team Members" open={open} onCancel={localOnClose}>
      <ModalContent>
        <InfoBox>
          <Text as={"li"}>
            Only individuals who are non-invited and not associated with another
            organization can be invited.
          </Text>
          <Text as={"li"}>
            Upon opening the app (and creating an account if new), recipients
            will immediately see their pending invitation and be able to accept
            or decline it.
          </Text>
          <Text as={"li"}>
            You can check delivery progress anytime under the
            <strong> Invitations Tab</strong>.
          </Text>
        </InfoBox>

        <FormField>
          <LabelRow>
            <Label>Email Recipients</Label>
            <Counter isMax={currentEmails.length >= maxEmails}>
              {currentEmails.length} / {maxEmails} max
            </Counter>
          </LabelRow>

          <InputContainer hasError={!!errors.inputValue}>
            {fields.map((field, index) => {
              const emailValue = currentEmails[index];
              return (
                <Tooltip title="Double click to edit" key={field.id}>
                  <EmailTag onDoubleClick={() => editEmail(index)}>
                    {emailValue.content}
                    <RemoveButton onClick={() => remove(index)}>
                      &times;
                    </RemoveButton>
                  </EmailTag>
                </Tooltip>
              );
            })}

            <Controller
              control={control}
              name="inputValue"
              rules={{
                validate: {
                  pattern: (v) =>
                    !v.trim() ||
                    REGEXES.email.test(v.trim()) ||
                    "Please enter a valid email address",
                  duplicate: (v) =>
                    !currentEmails
                      .map((e) => e.content)
                      .includes(v.trim().toLowerCase()) ||
                    "This email has already been added to the list",
                  maxLimit: (v) =>
                    !v.trim() ||
                    currentEmails.length < maxEmails ||
                    `You can only invite up to ${maxEmails} members at once`,
                },
              }}
              render={({ field: { onBlur, value, onChange } }) => (
                <StyledInput
                  id="email-input"
                  value={value}
                  onChange={(e) =>
                    onChange(e.currentTarget.value.toLowerCase())
                  }
                  onKeyDown={handleKeyDown}
                  onBlur={(e) => {
                    onBlur();
                    handleInputBlur(e);
                  }}
                  placeholder={
                    currentEmails.length === 0
                      ? "Enter email addresses separated by comma or Enter"
                      : ""
                  }
                  disabled={currentEmails.length >= maxEmails}
                />
              )}
            />
          </InputContainer>

          {errors.inputValue ? (
            <ErrorText>{errors.inputValue.message}</ErrorText>
          ) : (
            <HelpText>
              Double-click any tag to pull it back into the input for
              modifications.
            </HelpText>
          )}
        </FormField>

        <Button
          disabled={
            (currentEmails.length === 0 && !currentInputValue.trim()) ||
            Boolean(errors.inputValue)
          }
          onClick={handleSubmit(onSubmit)}
          loading={loading}
        >
          Send Invitations
        </Button>
      </ModalContent>
    </Modal>
  );
};
