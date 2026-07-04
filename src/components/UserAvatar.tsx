import type React from "react";
import styled from "styled-components";
import type { User } from "../model/user/types/User";
import { Image } from "./Image";
import type { ThemeType } from "../theme/theme";

type UserAvatarProps = {
  user: User | Partial<User>;
  width?: React.CSSProperties["width"];
  borderRadius?: keyof ThemeType["radius"];
  className?: string;
};

const AvatarWrapper = styled.div`
  position: relative;
  user-select: none;
`;

const Avatar = styled.div<{
  width: UserAvatarProps["width"];
  borderRadius: UserAvatarProps["borderRadius"];
}>`
  width: ${({ width }) => width};
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme, borderRadius }) => theme.radius[borderRadius!]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    #6366f1 100%
  );
  color: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${({ width }) => width} * 0.4);
  font-weight: 700;

  .ant-image {
    width: 100% !important;
    height: 100% !important;
    border-radius: inherit;
  }

  .ant-image-img {
    border-radius: inherit;
  }
`;

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  width = "3rem",
  borderRadius = "full",
  className,
}) => {
  if (!user || (!user.name && !user.avatar)) {
    return null;
  }

  console.log("-------");

  return (
    <AvatarWrapper className={className}>
      <Avatar width={width} borderRadius={borderRadius}>
        {user.avatar ? (
          <Image src={user.avatar} />
        ) : (
          user.name!.charAt(0)?.toUpperCase()
        )}
      </Avatar>
    </AvatarWrapper>
  );
};
