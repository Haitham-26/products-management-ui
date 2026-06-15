import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import type { ThemeType } from "../theme/theme";
import { useTheme } from "styled-components";

type IconProps = {
  icon: IconProp;
  size?: SizeProp;
  className?: string;
  color?: keyof ThemeType["colors"];
};

export const Icon: React.FC<IconProps> = ({ color, ...props }) => {
  const { colors } = useTheme();

  return (
    <FontAwesomeIcon color={color ? colors[color] : undefined} {...props} />
  );
};
