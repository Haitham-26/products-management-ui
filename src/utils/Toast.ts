import { AxiosError } from "axios";
import { toast } from "sonner";

export class Toast {
  static success(message: string) {
    return toast.success(message);
  }

  static error(message: string) {
    return toast.error(message);
  }

  static apiError(e: AxiosError | any) {
    if (e instanceof AxiosError && e.response?.data?.message) {
      return toast.error(e.response.data.message);
    }

    if (typeof e === "string") {
      return toast.error(e);
    }

    return toast.error("Something went wrong");
  }
}
