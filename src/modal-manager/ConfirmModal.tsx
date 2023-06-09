import React from "react";
import {
  Button,
  ButtonGroup,
  Box,
  ButtonProps,
  ModalFooter,
  ButtonGroupProps
} from "@chakra-ui/react";
import { ConfirmLabels } from "./context";
import { useModals } from "./use-modals";

export interface ConfirmModalProps {
  id?: string;
  children?: React.ReactNode;
  onCancel?(): void;
  onConfirm?(): void;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  cancelProps?: ButtonProps & React.ComponentPropsWithoutRef<"button">;
  confirmProps?: ButtonProps & React.ComponentPropsWithoutRef<"button">;
  groupProps?: ButtonGroupProps;
  labels?: ConfirmLabels;
}

export function ConfirmModal({
  id,
  cancelProps,
  confirmProps,
  labels = { cancel: "", confirm: "" },
  closeOnConfirm = true,
  closeOnCancel = true,
  groupProps,
  onCancel,
  onConfirm,
  children
}: ConfirmModalProps) {
  const { cancel: cancelLabel, confirm: confirmLabel } = labels;
  const ctx = useModals();

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof cancelProps?.onClick === "function" && cancelProps?.onClick(event);
    typeof onCancel === "function" && onCancel();
    closeOnCancel && ctx.closeModal(id);
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof confirmProps?.onClick === "function" && confirmProps?.onClick(event);
    typeof onConfirm === "function" && onConfirm();
    closeOnConfirm && ctx.closeModal(id);
  };

  return (
    <>
      {children && <Box mb="md">{children}</Box>}

      <ModalFooter>
        <Button variant="default" {...cancelProps} onClick={handleCancel}>
          {cancelProps?.children || cancelLabel}
        </Button>

        <Button {...confirmProps} onClick={handleConfirm}>
          {confirmProps?.children || confirmLabel}
        </Button>
      </ModalFooter>
    </>
  );
}
