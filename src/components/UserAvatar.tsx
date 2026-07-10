import type React from "react";
import styled from "styled-components";
import type { User } from "../model/user/types/User";
import { Image } from "./Image";
import type { ThemeType } from "../theme/theme";
import { isString } from "lodash";
import type { UploadFile } from "antd";
import { useMemo } from "react";

type UserWithoutAvatar = Omit<User, "avatar">;

type UserAvatarProps = {
  user: (UserWithoutAvatar | Partial<UserWithoutAvatar>) & {
    avatar?: string | UploadFile;
  };
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
  const isAvatarEmpty = !user.avatar || user.avatar === "null";

  // eslint-disable-next-line
  const src = useMemo(() => {
    if (isAvatarEmpty) {
      return "";
    }

    if (isString(user.avatar)) {
      return user.avatar;
    }

    if (user.avatar?.originFileObj) {
      return URL.createObjectURL(user.avatar.originFileObj);
    }

    return "";
  }, [user?.avatar, isAvatarEmpty]);

  return (
    <AvatarWrapper className={className}>
      <Avatar width={width} borderRadius={borderRadius}>
        {!isAvatarEmpty ? (
          <Image src={src} />
        ) : (
          user.name?.charAt(0)?.toUpperCase()
        )}
      </Avatar>
    </AvatarWrapper>
  );
};
