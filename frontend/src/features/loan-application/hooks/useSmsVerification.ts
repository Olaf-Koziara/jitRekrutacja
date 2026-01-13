import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsApi } from '@/api/mocks';
import { SignContractDTO } from '@/api/types';
import { useMutation } from '@tanstack/react-query';

export function useSmsVerification(applicationId: string) {
  const [smsSent, setSmsSent] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const startCooldown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setCooldownSeconds(60);
    timerRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendSmsCodeMutation = useMutation({
    mutationFn: () => applicationsApi.sendSmsCode(applicationId),
    onSuccess: () => {
      setSmsSent(true);
      startCooldown();
    },
  });

  const verifyAndSignMutation = useMutation({
    mutationFn: (data: SignContractDTO) => applicationsApi.signContract(applicationId, data),
    onSuccess: () => {
      navigate(`/application/${applicationId}/success`);
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    isLoading: sendSmsCodeMutation.isPending || verifyAndSignMutation.isPending,
    error: sendSmsCodeMutation.error || verifyAndSignMutation.error,
    smsSent,
    cooldownSeconds,
    sendSmsCode: sendSmsCodeMutation.mutateAsync,
    verifyAndSign: verifyAndSignMutation.mutateAsync,
    clearError: () => {
      sendSmsCodeMutation.reset();
      verifyAndSignMutation.reset();
    },
  };
}
