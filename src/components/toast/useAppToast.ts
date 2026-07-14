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
        message: t("common.success"),
        description,
        placement,
      });
    },

    error(description: string) {
      toast.error({
        message: t("common.error"),
        description,
        placement,
      });
    },

    apiError(error: unknown) {
      if (
        error instanceof AxiosError &&
        typeof error.response?.data?.message === "string"
      ) {
        toast.error({
          message: t("common.apiError"),
          description: error.response.data.message,
          placement,
        });

        return;
      }

      toast.error({
        message: t("common.error"),
        description:
          typeof error === "string" ? error : t("errors.general.unexpected"),
        placement,
      });
    },
  };
};
