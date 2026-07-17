import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useToast } from "./ToastContext";
import isString from "lodash/isString";

export const useAppToast = () => {
  const toast = useToast();

  const { t, i18n } = useTranslation();

  const placement = i18n.dir() === "rtl" ? "topLeft" : "topRight";

  return {
    success(description: string) {
      toast.success({
        title: t("common.success"),
        description,
        placement,
      });
    },

    error(description: string) {
      toast.error({
        title: t("common.error"),
        description,
        placement,
      });
    },

    apiError(error: unknown) {
      if (
        error instanceof AxiosError &&
        isString(error.response?.data?.message)
      ) {
        const message = error.response.data.message;
        const params =
          (error.response.data?.params as Record<string, string>) || {};

        toast.error({
          title: t("common.error"),
          description: t(message, {
            ...params,
            defaultValue: t("serverErrors.internal"),
          }),
          placement,
        });

        return;
      }

      toast.error({
        title: t("common.error"),
        description: isString(error)
          ? t(error)
          : t("errors.general.unexpected"),
        placement,
      });
    },
  };
};
