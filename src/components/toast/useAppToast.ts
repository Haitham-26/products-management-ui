import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useToast } from "./ToastContext";

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
        typeof error.response?.data?.message === "string"
      ) {
        console.log(error.response.data.p);

        toast.error({
          title: t("common.error"),
          description: t(error.response.data.message, {
            ...((error.response.data?.params as Record<string, string>) || {}),
            defaultValue: t("serverErrors.internal"),
          }),
          placement,
        });

        return;
      }

      toast.error({
        title: t("common.error"),
        description:
          typeof error === "string" ? t(error) : t("errors.general.unexpected"),
        placement,
      });
    },
  };
};
