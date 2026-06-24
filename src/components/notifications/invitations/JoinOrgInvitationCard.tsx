import React from "react";
import { Text } from "../../Text";
import { Button } from "../../Button";
import type { JoinOrgInvitation } from "../../../model/user/users-permissions/types/JoinOrgInvitation";

type Props = {
  invitation: JoinOrgInvitation;
};

export const JoinOrgInvitationCard: React.FC<Props> = ({ invitation }) => {
  const onDecline = () => {
    console.log("Decline");
  };

  const onAccept = () => {
    console.log("Accept");
  };

  return (
    <div
      style={{
        padding: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "#fff",
      }}
    >
      <Text fontWeight={600}>
        {invitation.inviter.name} invited you to join their organization
      </Text>

      <Text color="textSecondary" fontSize="small">
        You have been invited to join{" "}
        <strong>{invitation.inviter.name}'s</strong> organization. Please note
        that your personal account data will be hidden while you are a member,
        and will become visible again if you choose to leave the organization.
      </Text>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 6,
        }}
      >
        <Button variant="secondary" onClick={onDecline}>
          Decline
        </Button>

        <Button variant="primary" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
};
