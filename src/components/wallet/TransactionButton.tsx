"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Abi, Address, Hash } from "viem";
import { base } from "wagmi/chains";

type ContractCall = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
};

type TransactionStatus =
  | { statusName: "init"; statusData: null }
  | { statusName: "pending"; statusData: null }
  | { statusName: "confirmed"; statusData: { transactionHash: Hash } }
  | {
      statusName: "success";
      statusData: { transactionHash: Hash; blockNumber: bigint };
    }
  | { statusName: "error"; statusData: { message: string } };

type TransactionButtonProps = {
  call: ContractCall;
  chainId: typeof base.id;
  buttonText?: string;
  disabled?: boolean;
  disabledMessage?: string | null;
  className?: string;
};

function getExplorerBase(chainId: number) {
  return chainId === base.id ? "https://basescan.org" : "https://etherscan.io";
}

export function TransactionButton({
  call,
  chainId,
  buttonText = "Send transaction",
  disabled = false,
  disabledMessage,
  className,
}: TransactionButtonProps) {
  const { address, chainId: activeChainId, isConnected } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const {
    data: transactionHash,
    error: writeError,
    isPending: isWritePending,
    reset,
    writeContractAsync,
  } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt(
    {
      hash: transactionHash,
      chainId,
    },
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const status = useMemo<TransactionStatus>(() => {
    if (submitError) {
      return {
        statusName: "error",
        statusData: { message: submitError },
      };
    }

    if (writeError) {
      return {
        statusName: "error",
        statusData: {
          message: writeError.message || "Transaction failed.",
        },
      };
    }

    if (receipt) {
      return {
        statusName: "success",
        statusData: {
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
        },
      };
    }

    if (transactionHash) {
      return {
        statusName: "confirmed",
        statusData: { transactionHash },
      };
    }

    if (isWritePending || isSwitching) {
      return { statusName: "pending", statusData: null };
    }

    return { statusName: "init", statusData: null };
  }, [
    isSwitching,
    isWritePending,
    receipt,
    submitError,
    transactionHash,
    writeError,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!isConnected || !address) {
      setSubmitError("Connect a wallet before sending hOUR.");
      return;
    }

    try {
      setSubmitError(null);

      if (activeChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      await writeContractAsync({
        address: call.address,
        abi: call.abi,
        functionName: call.functionName,
        args: call.args ?? [],
        value: call.value,
        chainId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Transaction failed.";
      setSubmitError(message);
    }
  }, [
    activeChainId,
    address,
    call.abi,
    call.address,
    call.args,
    call.functionName,
    call.value,
    chainId,
    isConnected,
    switchChainAsync,
    writeContractAsync,
  ]);

  const handleReset = useCallback(() => {
    reset();
    setSubmitError(null);
  }, [reset]);

  const actionLabel = useMemo(() => {
    if (isSwitching) {
      return "Switching network...";
    }

    if (isWritePending) {
      return "Confirm in wallet...";
    }

    if (isConfirming || status.statusName === "confirmed") {
      return "Transaction in progress...";
    }

    if (status.statusName === "error") {
      return "Try again";
    }

    if (status.statusName === "success") {
      return "View transaction";
    }

    return buttonText;
  }, [
    buttonText,
    isConfirming,
    isSwitching,
    isWritePending,
    status.statusName,
  ]);

  const handlePrimaryAction = () => {
    if (status.statusName === "success") {
      window.open(
        `${getExplorerBase(chainId)}/tx/${status.statusData.transactionHash}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (status.statusName === "error") {
      handleReset();
      return;
    }

    void handleSubmit();
  };

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`.trim()}>
      <button
        type="button"
        onClick={handlePrimaryAction}
        disabled={disabled || !isConnected || isSwitching || isWritePending || isConfirming}
        className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-4 py-3 text-sm font-medium text-fuchsia-50 transition hover:border-fuchsia-300/70 hover:bg-fuchsia-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {actionLabel}
      </button>

      {status.statusName === "error" ? (
        <p className="text-sm text-rose-300">{status.statusData.message}</p>
      ) : null}

      {disabledMessage && status.statusName !== "error" ? (
        <p className="text-sm text-amber-200/90">{disabledMessage}</p>
      ) : null}

      {status.statusName === "success" ? (
        <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Transaction confirmed in block {status.statusData.blockNumber.toString()}.
          Use the button above to open the explorer.
        </div>
      ) : null}
    </div>
  );
}
