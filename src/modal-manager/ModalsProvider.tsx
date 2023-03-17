import React, { useCallback, useReducer, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "@chakra-ui/react";
import { randomId } from "./utils/random-id";
import {
  ModalsContext,
  ModalSettings,
  ConfirmLabels,
  OpenConfirmModal,
  OpenContextModal,
  ContextModalProps,
  ModalsContextProps
} from "./context";
import { ConfirmModal } from "./ConfirmModal";
import { modalsReducer } from "./reducer";
import { useModalsEvents } from "./events";

// TODO: Move it to props
export const MODAL_Z_INDEX = 200;

export interface ModalsProviderProps {
  /** Your app */
  children: React.ReactNode;

  /** Predefined modals */
  modals?: Record<string, React.FC<ContextModalProps<any>>>;

  /** Shared Modal component props, applied for every modal */
  modalProps?: ModalSettings;

  /** Confirm modal labels */
  labels?: ConfirmLabels;
}

function separateConfirmModalProps(props: OpenConfirmModal) {
  if (!props) {
    return { confirmProps: {}, modalProps: {} };
  }

  const {
    id,
    children,
    onCancel,
    onConfirm,
    closeOnConfirm,
    closeOnCancel,
    cancelProps,
    confirmProps,
    groupProps,
    labels,
    ...others
  } = props;

  return {
    confirmProps: {
      id,
      children,
      onCancel,
      onConfirm,
      closeOnConfirm,
      closeOnCancel,
      cancelProps,
      confirmProps,
      groupProps,
      labels
    },
    modalProps: {
      id,
      ...others
    }
  };
}

export function ModalsProvider({
  children,
  modalProps,
  labels,
  modals
}: ModalsProviderProps) {
  const [state, dispatch] = useReducer(modalsReducer, {
    modals: [],
    current: null
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const closeAll = useCallback(
    (canceled?: boolean) => {
      stateRef.current.modals.forEach((modal) => {
        if (modal.type === "confirm" && canceled) {
          modal.props.onCancel?.();
        }

        modal.props.onClose?.();
      });
      dispatch({ type: "CLOSE_ALL" });
    },
    [stateRef, dispatch]
  );

  const openModal = useCallback(
    ({ modalId, ...props }: ModalSettings) => {
      const id = modalId || randomId();

      dispatch({
        type: "OPEN",
        payload: {
          id,
          type: "content",
          props
        }
      });
      return id;
    },
    [dispatch]
  );

  const openConfirmModal = useCallback(
    ({ modalId, ...props }: OpenConfirmModal) => {
      const id = modalId || randomId();
      dispatch({
        type: "OPEN",
        payload: {
          id,
          type: "confirm",
          props
        }
      });
      return id;
    },
    [dispatch]
  );

  const openContextModal = useCallback(
    (modal: string, { modalId, ...props }: OpenContextModal) => {
      const id = modalId || randomId();
      dispatch({
        type: "OPEN",
        payload: {
          id,
          type: "context",
          props,
          ctx: modal
        }
      });
      return id;
    },
    [dispatch]
  );

  const closeModal = useCallback(
    (id: string, canceled?: boolean) => {
      const modal = stateRef.current.modals.find((item) => item.id === id);
      if (!modal) {
        return;
      }

      if (modal.type === "confirm" && canceled) {
        modal.props.onCancel?.();
      }
      modal.props.onClose?.();
      dispatch({ type: "CLOSE", payload: modal.id });
    },
    [stateRef, dispatch]
  );

  useModalsEvents({
    openModal,
    openConfirmModal,
    openContextModal: ({ modal, ...payload }) =>
      openContextModal(modal, payload),
    closeModal,
    closeAllModals: closeAll
  });

  const ctx: ModalsContextProps = {
    modals: state.modals,
    openModal,
    openConfirmModal,
    openContextModal,
    closeModal,
    closeAll
  };

  const getCurrentModal = () => {
    const currentModal = stateRef.current.current;
    switch (currentModal?.type) {
      case "context": {
        const { innerProps, ...rest } = currentModal.props;
        const ContextModal = modals?.[currentModal.ctx] || (() => null);

        return {
          modalProps: rest,
          content: (
            <ContextModal
              innerProps={innerProps}
              context={ctx}
              id={currentModal.id}
            />
          )
        };
      }
      case "confirm": {
        const {
          modalProps: separatedModalProps,
          confirmProps: separatedConfirmProps
        } = separateConfirmModalProps(currentModal.props);

        return {
          modalProps: separatedModalProps,
          content: (
            <ConfirmModal
              {...separatedConfirmProps}
              id={currentModal.id}
              labels={currentModal.props.labels || labels}
            />
          )
        };
      }
      case "content": {
        const { children: currentModalChildren, ...rest } = currentModal.props;

        return {
          modalProps: rest,
          content: <>{currentModalChildren}</>
        };
      }
      default: {
        return {
          modalProps: {},
          content: null
        };
      }
    }
  };

  const { modalProps: currentModalProps, content } = getCurrentModal();

  return (
    <ModalsContext.Provider value={ctx}>
      <Modal
        zIndex={MODAL_Z_INDEX + 1}
        {...modalProps}
        {...currentModalProps}
        isOpen={state.modals.length > 0}
        onClose={() => closeModal(state.current?.id!)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{currentModalProps.title}</ModalHeader>
          {content}
        </ModalContent>
      </Modal>
      {children}
    </ModalsContext.Provider>
  );
}
