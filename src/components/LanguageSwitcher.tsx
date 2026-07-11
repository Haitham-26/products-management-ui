import type React from "react";
import { Dropdown, type DropdownProps } from "./Dropdown";
import { Button } from "./Button";
import { faLanguage } from "@fortawesome/free-solid-svg-icons/faLanguage";
import styled from "styled-components";
import type { ThemeType } from "../theme/theme";
import { Image } from "./Image";
import { Images } from "../assets";
import { AppLangs } from "../model/app/types/AppLangs.enum";
import { changeLanguage } from "../utils/i18nUtils";

const menu: DropdownProps["menu"] = {
  items: [
    {
      key: "en",
      icon: <Image src={Images.FlagUSA} alt="English" width={25} />,
      onClick: () => changeLanguage(AppLangs.EN),
    },
    {
      key: "ar",
      icon: <Image src={Images.FlagSyria} alt="Arabic" width={25} />,
      onClick: () => changeLanguage(AppLangs.AR),
    },
  ],
};

type LanguageSwitcherProps = {
  color?: keyof ThemeType["colors"];
};

const StyledButton = styled(Button)<{ color: LanguageSwitcherProps["color"] }>`
  background-color: transparent;
  color: ${({ theme, color }) => theme.colors[color!]};
  width: fit-content;
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  color = "primary",
}) => {
  return (
    <Dropdown menu={menu}>
      <StyledButton color={color} icon={faLanguage} iconSize="xl" />
    </Dropdown>
  );
};
