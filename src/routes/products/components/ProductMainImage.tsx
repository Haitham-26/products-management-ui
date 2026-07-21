import type React from "react";
import styled from "styled-components";
import { Image } from "../../../components/Image";
import { Icon } from "../../../components/Icon";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import type { ThemeType } from "../../../theme/theme";
import { Grid } from "antd";

type ProductMainImageProps = {
  url?: string;
  width?: React.CSSProperties["width"];
  borderRadius?: keyof ThemeType["radius"];
};

const StyledImage = styled(Image)<
  Pick<ProductMainImageProps, "width" | "borderRadius">
>`
  width: ${({ width }) => width} !important;
  height: ${({ width }) => width} !important;
  border-radius: ${({ theme, borderRadius }) =>
    borderRadius
      ? theme.radius[borderRadius as keyof ThemeType["radius"]]
      : `calc(${theme.radius.sm} * 0.75)`};
  border: ${({ theme }) => `1px solid ${theme.colors.textSecondary}5a`};

  .ant-image-img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: inherit !important;
  }
`;

const Placeholder = styled.div<
  Pick<ProductMainImageProps, "width" | "borderRadius">
>`
  width: ${({ width }) => width};
  height: ${({ width }) => width};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary}5a;
  border: ${({ theme }) => `1px solid ${theme.colors.textSecondary}5a`};
  border-radius: ${({ theme, borderRadius }) =>
    borderRadius
      ? theme.radius[borderRadius as keyof ThemeType["radius"]]
      : `calc(${theme.radius.sm} * 0.75)`};

  svg {
    font-size: ${({ width }) => `calc(${width} * 0.4)`};
  }
`;

export const ProductMainImage: React.FC<ProductMainImageProps> = ({
  url,
  width = "1.5rem",
  borderRadius,
}) => {
  const { md } = Grid.useBreakpoint();

  if (url) {
    return (
      <StyledImage
        src={url}
        width={width}
        borderRadius={borderRadius}
        loading="lazy"
        preview={!md}
      />
    );
  }

  return (
    <Placeholder width={width} borderRadius={borderRadius}>
      <Icon icon={faImage} />
    </Placeholder>
  );
};
