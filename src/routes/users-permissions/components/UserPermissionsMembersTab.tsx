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
import capitalize from "lodash/capitalize";
import type { UserPermissions } from "../../../model/user/types/UserPermissions";
import { Switch, Tooltip } from "antd";
import { Dropdown } from "../../../components/Dropdown";
import { Icon } from "../../../components/Icon";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPersonCircleXmark } from "@fortawesome/free-solid-svg-icons/faPersonCircleXmark";
import { Button } from "../../../components/Button";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { usersPermissionsActions } from "../../../redux/users-permissions/users-permissions.slice";
import usersPermissionsSliceSelectors from "../../../redux/users-permissions/users-permissions.selector";

const StickyBar = styled.div<{ blur: boolean }>`
  position: sticky;
  top: 6.5rem;
  z-index: 100;
  margin-bottom: ${({ theme, blur }) => (!blur ? theme.spacing.md : 0)};

  padding-inline-start: ${({ theme, blur }) => (blur ? theme.spacing.md : 0)};

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition:
    background 0.2s ease,
    padding 0.4s ease;
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

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ExpandIcon = styled(Icon)<{ isActive: boolean }>`
  transition: all 0.2s ease;
  transform: rotate(${({ isActive }) => (isActive ? "0deg" : "-90deg")});
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  span:first-child {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.typography.body};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.small};
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const PermissionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
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

export const UserPermissionsMembersTab: React.FC = () => {
  const [shouldBlurStickyHeader, setShouldBlurStickyHeader] = useState(false);

  const members = useAppSelector(
    usersPermissionsSliceSelectors.selectOrganizationMembers,
  );
  const user = useAppSelector(userSliceSelectors.selectUser);
  const isOrganization = useAppSelector(
    userSliceSelectors.selectIsOrganization,
  );

  const dispatch = useAppDispatch();

  const { control, setValue, handleSubmit } =
    useForm<UpdateMembersPermissionsDto>({
      defaultValues: {
        userId: user._id,
        members: Object.fromEntries(members.map((m) => [m._id, m.permissions])),
      },
    });

  const liveMembers = useWatch({
    control,
    name: "members",
  });

  const onSubmit = (data: UpdateMembersPermissionsDto) => {
    dispatch(usersPermissionsActions.updateMembersPermissions(data));
  };

  useEffect(() => {
    dispatch(
      usersPermissionsActions.getOrganizationMembers({ userId: user._id }),
    );
  }, [dispatch, user._id]);

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
      {isOrganization ? (
        <StickyBar blur={shouldBlurStickyHeader}>
          <Text fontWeight="bold">Members Permissions</Text>

          <Button onClick={handleSubmit(onSubmit)}>Save changes</Button>
        </StickyBar>
      ) : null}

      <Collapse
        expandIconPlacement="end"
        expandIcon={({ isActive }) =>
          isOrganization ? (
            <ExpandIcon icon={faAngleDown} isActive={Boolean(isActive)} />
          ) : null
        }
        collapsible="icon"
        items={[user, ...members].map((m) => {
          const permissions = liveMembers[m._id!];
          const availableActions = Object.values(CRUDPermissions);
          const entities = Object.keys(m.permissions || {});

          return {
            key: m._id,
            label: (
              <MemberHeader>
                <Avatar>
                  <Text fontWeight="bold">
                    {m.name?.charAt(0).toUpperCase()}
                  </Text>
                </Avatar>
                <Info>
                  <Text fontWeight="bold">
                    {m.name}
                    {m._id === user._id ? (
                      <span style={{ fontStyle: "italic" }}> (You)</span>
                    ) : null}
                  </Text>
                  <Text fontSize="small" color="textSecondary">
                    {m.email}
                  </Text>
                </Info>
              </MemberHeader>
            ),
            extra: isOrganization ? (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: [
                    {
                      key: "remove",
                      icon: <Icon icon={faPersonCircleXmark} />,
                      label: "Kick member",
                      danger: true,
                    },
                  ],
                }}
              >
                <Icon icon={faEllipsis} />
              </Dropdown>
            ) : null,
            children: isOrganization ? (
              <TableWrapper>
                <PermissionTable>
                  <thead>
                    <tr>
                      <Th>Entity</Th>
                      {availableActions.map((action) => (
                        <Th key={action}>{capitalize(action)}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entities.map((entityKey) => {
                      const typedEntityKey = entityKey as keyof UserPermissions;

                      return (
                        <Tr key={entityKey}>
                          <Td>
                            <Text
                              fontWeight="bold"
                              fontSize="small"
                              color="textSecondary"
                            >
                              {capitalize(entityKey)}
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
                                  render={({ field: { onChange, value } }) => {
                                    const shouldDisable =
                                      !permissions?.[typedEntityKey]?.READ &&
                                      actionKey !== CRUDPermissions.READ;

                                    return (
                                      <Tooltip
                                        title={
                                          shouldDisable
                                            ? "Read permissions should be enabled first."
                                            : undefined
                                        }
                                      >
                                        <Switch
                                          size="small"
                                          checked={!!value}
                                          disabled={shouldDisable}
                                          onChange={(v) => {
                                            onChange(v);

                                            if (
                                              !v &&
                                              actionKey === CRUDPermissions.READ
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
          };
        })}
      />
    </Fragment>
  );
};
