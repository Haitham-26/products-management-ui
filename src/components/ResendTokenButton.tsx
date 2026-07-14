import React, { Fragment, useEffect, useState } from "react";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import Countdown from "antd/es/statistic/Countdown";
import styled from "styled-components";
import { Text } from "./Text";
import { Toast } from "../utils/Toast";
import { useTranslation } from "react-i18next";

const RESEND_DELAY = 2 * 60 * 1000;

const StyledButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  width: fit-content;
  padding: 0;
  font-size: calc(${({ theme }) => theme.typography.small} * 0.9);
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledSpinner = styled(Spinner)`
  width: 1rem;
  height: 1rem;
`;

const CountdownWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: calc(${({ theme }) => theme.spacing.sm} / 2);

  p,
  .ant-statistic-content {
    font-size: calc(${({ theme }) => theme.typography.small} * 0.9) !important;
  }

  .ant-statistic {
    display: inline;
  }

  .ant-statistic-content {
    font-size: inherit;
    line-height: inherit;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

type ResendVerificationButtonProps = {
  localStorageKey: string;
  onResend: () => Promise<void>;
};

export const ResendVerificationButton: React.FC<
  ResendVerificationButtonProps
> = ({ onResend, localStorageKey }) => {
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);

  const { t } = useTranslation(undefined, { keyPrefix: "resendToken" });

  const handleResend = async () => {
    try {
      setLoading(true);

      await onResend();

      const now = Date.now();
      const expiresAt = now + RESEND_DELAY;

      localStorage.setItem(localStorageKey, String(now));

      setDeadline(expiresAt);

      Toast.success(t("success"));
    } catch (e) {
      console.error(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timestamp = localStorage.getItem(localStorageKey);

    if (!timestamp) {
      localStorage.setItem(localStorageKey, String(Date.now()));
      setDeadline(Date.now() + RESEND_DELAY);
      return;
    }

    const expiresAt = Number(timestamp) + RESEND_DELAY;

    if (expiresAt > Date.now()) {
      setDeadline(expiresAt);
    }
  }, [localStorageKey]);

  return (
    <Fragment>
      {deadline ? (
        <CountdownWrapper>
          <Text color="textSecondary" fontSize="small">
            {t("resendIn")}
          </Text>

          <Countdown
            value={deadline}
            format="mm:ss"
            onFinish={() => setDeadline(null)}
          />
        </CountdownWrapper>
      ) : (
        <ActionContainer>
          <StyledButton onClick={handleResend} disabled={loading}>
            {t("resend")}
          </StyledButton>

          {loading ? <StyledSpinner /> : null}
        </ActionContainer>
      )}
    </Fragment>
  );
};
