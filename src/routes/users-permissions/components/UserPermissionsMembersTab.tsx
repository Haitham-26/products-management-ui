import type React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { UpdateMembersPermissionsDto } from "../../../model/user/dto/UpdateMembersPermissionsDto";
import { Fragment, useEffect, useState } from "react";
import { Collapse } from "../../../components/Collapse";
import styled from "styled-components";
import { Text } from "../../../components/Text";
import { CRUDPermissions } from "../../../model/user/types/CRUDPermissions.enum";
import type { UserPermissions } from "../../../model/user/types/UserPermissions";
import { Switch, Tooltip } from "antd";
import { Dropdown } from "../../../components/Dropdown";
import { Icon } from "../../../components/Icon";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPersonCircleXmark } from "@fortawesome/free-solid-svg-icons/faPersonCircleXmark";
import { Button } from "../../../components/Button";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { organizationActions } from "../../../redux/organization/organization.slice";
import organizationSliceSelectors from "../../../redux/organization/organization.selector";
import { SpinnerFullScreen } from "../../../components/SpinnerFullScreen";
import type { User } from "../../../model/user/types/User";
import { WarningModal } from "../../../components/WarningModal";
import isEmpty from "lodash/isEmpty";
import { UserRoles } from "../../../model/user/types/UserRoles.enum";
import type { ThemeType } from "../../../theme/theme";
import { Empty } from "../../../components/Empty";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { UserAvatar } from "../../../components/UserAvatar";
import { Trans, useTranslation } from "react-i18next";
import { useAppToast } from "../../../components/toast/useAppToast";

const StickyBar = styled.div<{ blur: boolean }>`
  position: sticky;
  top: 6.5rem;
  z-index: 100;
  margin-bottom: ${({ theme, blur }) => (!blur ? theme.spacing.md : 0)};

  padding-inline: ${({ theme, blur }) => (blur ? theme.spacing.md : 0)};
  padding-block: ${({ theme, blur }) => (blur ? theme.spacing.sm : 0)};

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition:
    background 0.2s ease,
    padding 0.3s ease;
  background: ${({ blur }) =>
    blur ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0)"};

  backdrop-filter: ${({ blur }) => (blur ? "blur(10px)" : "none")};
  -webkit-backdrop-filter: ${({ blur }) => (blur ? "blur(10px)" : "none")};
`;

const MemberHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ExpandIcon = styled(Icon)<{ isActive: boolean }>`
  transition: all 0.2s ease;
  transform: rotate(${({ isActive }) => (isActive ? "0deg" : "-90deg")});
`;

const Name = styled(Text)`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const Badge = styled.span<{
  background: keyof ThemeType["colors"];
  color: keyof ThemeType["colors"];
}>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.full};

  display: inline-flex;
  align-items: center;

  font-size: 0.7rem !important;
  font-weight: 700;
  text-transform: uppercase;

  background-color: ${({ theme, background }) => theme.colors[background]};

  color: ${({ theme, color }) => theme.colors[color]} !important;

  user-select: none;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const PermissionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: start;
`;

const Th = styled.th`
  text-align: start;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.small};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.body};
`;

const Tr = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

type UserPermissionsMembersTabProps = {
  setInviteMembersModalVisible: VoidCallback<boolean>;
};

export const UserPermissionsMembersTab: React.FC<
  UserPermissionsMembersTabProps
> = ({ setInviteMembersModalVisible }) => {
  const [shouldBlurStickyHeader, setShouldBlurStickyHeader] = useState(false);
  useState(false);
  const [removeMemberLoading, setRemoveMemberLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Partial<User> | null>(
    null,
  );
  const [saveLoading, setSaveLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm<UpdateMembersPermissionsDto>();

  const liveMembers = useWatch({
    control,
    name: "members",
  });

  const members = useAppSelector(
    organizationSliceSelectors.selectOrganizationMembers,
  );
  const membersLoading = useAppSelector(
    organizationSliceSelectors.selectOrganizationMembersLoading,
  );
  const user = useAppSelector(userSliceSelectors.selectUser);
  const isOrganization = !useAppSelector(userSliceSelectors.selectIsOrgMember);

  const onManageMembersPermissions = async () => {
    try {
      setSaveLoading(true);

      const dto = getValues();

      await dispatch(
        organizationActions.manageMembersPermissions(dto),
      ).unwrap();
      await dispatch(organizationActions.getOrganizationMembers()).unwrap();

      Toast.success(t("usersPermissions.members.updatePermissions.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setSaveLoading(false);
    }
  };

  const onRemoveMemebr = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      setRemoveMemberLoading(true);

      await dispatch(
        organizationActions.removeMember({
          userId: user._id,
          memberId: selectedMember._id!,
        }),
      ).unwrap();
      await dispatch(organizationActions.getOrganizationMembers()).unwrap();

      setSelectedMember(null);

      Toast.success(t("usersPermissions.members.removeMember.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setRemoveMemberLoading(false);
    }
  };

  useEffect(() => {
    reset({
      userId: user._id,
      members: Object.fromEntries(
        members
          .filter((m) => m._id !== user._id)
          .map((m) => [m._id, m.permissions]),
      ),
    });
  }, [members, user._id, reset]);

  useEffect(() => {
    dispatch(organizationActions.getOrganizationMembers());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 10 * 16;

      const shouldBlur = window.scrollY > threshold;

      setShouldBlurStickyHeader((prev) => {
        if (prev !== shouldBlur) {
          return shouldBlur;
        }
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Fragment>
      {isOrganization && members.length ? (
        <StickyBar blur={shouldBlurStickyHeader}>
          <Text fontWeight="bold">
            {t("usersPermissions.members.subtitle")}
          </Text>

          {members.length > 1 ? (
            <Button
              onClick={handleSubmit(onManageMembersPermissions)}
              loading={saveLoading}
              disabled={!isDirty}
            >
              {t("common.save")}
            </Button>
          ) : null}
        </StickyBar>
      ) : null}

      {!membersLoading && !members.length ? (
        <Empty description={t("usersPermissions.members.empty")}>
          <Button
            icon={faUserPlus}
            onClick={() => setInviteMembersModalVisible(true)}
          >
            {t("usersPermissions.actions.inviteMembers")}
          </Button>
        </Empty>
      ) : null}

      {!membersLoading ? (
        <Collapse
          expandIconPlacement="end"
          expandIcon={({ isActive }) =>
            isOrganization ? (
              <ExpandIcon icon={faAngleDown} isActive={Boolean(isActive)} />
            ) : null
          }
          collapsible="icon"
          items={members.map((m) => {
            const permissions = liveMembers?.[m._id!];
            const availableActions = Object.values(CRUDPermissions);
            const entities = Object.keys(m.permissions || {});

            return {
              key: m._id,
              label: (
                <MemberHeader>
                  <UserAvatar user={m} borderRadius="md" />

                  <Info>
                    <Name>
                      <span>{m.name}</span>

                      {m._id === user._id ? (
                        <Badge background="primary" color="onPrimary">
                          {t("common.you")}
                        </Badge>
                      ) : null}

                      {m.roles?.includes(UserRoles.OWNER) ? (
                        <Badge background="warning" color="background">
                          {t("common.owner")}
                        </Badge>
                      ) : null}
                    </Name>
                    <Text fontSize="small" color="textSecondary">
                      {m.email}
                    </Text>
                  </Info>
                </MemberHeader>
              ),
              extra:
                isOrganization && user._id !== m._id ? (
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        {
                          key: "remove",
                          icon: <Icon icon={faPersonCircleXmark} />,
                          label: t("common.remove"),
                          onClick: () => setSelectedMember(m),
                          danger: true,
                        },
                      ],
                    }}
                  >
                    <Icon icon={faEllipsis} />
                  </Dropdown>
                ) : null,
              children:
                isOrganization && user._id !== m._id ? (
                  <TableWrapper>
                    <PermissionTable>
                      <thead>
                        <tr>
                          <Th>{t("common.entity")}</Th>
                          {availableActions.map((action) => (
                            <Th key={action}>
                              {t(`common.${action.toLowerCase()}`)}
                            </Th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {entities.map((entityKey) => {
                          const typedEntityKey =
                            entityKey as keyof UserPermissions;

                          return (
                            <Tr key={entityKey}>
                              <Td>
                                <Text
                                  fontWeight="bold"
                                  fontSize="small"
                                  color="textSecondary"
                                >
                                  {t(`common.${typedEntityKey.toLowerCase()}`)}
                                </Text>
                              </Td>

                              {availableActions.map((actionKey) => (
                                <Td key={actionKey}>
                                  <CenterContainer>
                                    <Controller
                                      control={control}
                                      name={
                                        `members.${m._id}.${typedEntityKey}.${actionKey}` as const
                                      }
                                      render={({
                                        field: { onChange, value },
                                      }) => {
                                        const shouldDisable =
                                          !permissions?.[typedEntityKey]
                                            ?.READ &&
                                          actionKey !== CRUDPermissions.READ;

                                        return (
                                          <Tooltip
                                            title={
                                              shouldDisable
                                                ? t(
                                                    "usersPermissions.members.disabledCheckBoxTooltip",
                                                  )
                                                : undefined
                                            }
                                          >
                                            <Switch
                                              size="small"
                                              checked={Boolean(value)}
                                              disabled={shouldDisable}
                                              onChange={(v) => {
                                                onChange(v);

                                                if (
                                                  !v &&
                                                  actionKey ===
                                                    CRUDPermissions.READ
                                                ) {
                                                  setValue(
                                                    `members.${m._id}.${typedEntityKey}`,
                                                    {
                                                      CREATE: false,
                                                      READ: false,
                                                      UPDATE: false,
                                                      DELETE: false,
                                                    },
                                                  );
                                                }
                                              }}
                                            />
                                          </Tooltip>
                                        );
                                      }}
                                    />
                                  </CenterContainer>
                                </Td>
                              ))}
                            </Tr>
                          );
                        })}
                      </tbody>
                    </PermissionTable>
                  </TableWrapper>
                ) : null,
              showArrow: user._id !== m._id,
            };
          })}
        />
      ) : (
        <SpinnerFullScreen />
      )}

      <WarningModal
        title={t("usersPermissions.members.removeMember.title", {
          member: selectedMember?.name,
        })}
        description={
          <Trans
            i18nKey="usersPermissions.members.removeMember.description"
            values={{ member: selectedMember?.name }}
            components={[<strong />]}
          />
        }
        open={!isEmpty(selectedMember)}
        onClose={() => setSelectedMember(null)}
        confirmLoading={removeMemberLoading}
        onConfirm={onRemoveMemebr}
      />
    </Fragment>
  );
};
