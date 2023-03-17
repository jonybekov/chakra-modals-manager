import { Button, Text, Input, ModalFooter, ModalBody } from "@chakra-ui/react";
import {
  openConfirmModal,
  openModal,
  closeAllModals,
  openContextModal
} from "./modal-manager";

export function Demo() {
  return (
    <>
      <Button
        onClick={() =>
          openConfirmModal({
            children: (
              <ModalBody>
                <Text size="sm">
                  This action is so important that you are required to confirm
                  it with a modal. Please click one of these buttons to proceed.
                </Text>
              </ModalBody>
            ),
            labels: { confirm: "Saqlash", cancel: "Qaytarish" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => console.log("Confirmed")
          })
        }
      >
        Open confirm modal
      </Button>
      <Button
        onClick={() => {
          openModal({
            title: "Subscribe to newsletter",
            isCentered: true,
            children: (
              <>
                <ModalBody>
                  <Input placeholder="Your email" />
                </ModalBody>
                <ModalFooter>
                  <Button width="100%" onClick={() => closeAllModals()} mt="4">
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )
          });
        }}
      >
        Open content modal
      </Button>
      <Button
        onClick={() =>
          openContextModal({
            modal: "demonstration",
            title: "Test modal from context",
            innerProps: {
              modalBody:
                "This modal was defined in ModalsProvider, you can open it anywhere in you app with useModals hook"
            }
          })
        }
      >
        Open demonstration context modal
      </Button>
      <Button
        onClick={() =>
          openConfirmModal({
            title: "Please confirm your action",
            closeOnConfirm: false,
            labels: { confirm: "Next modal", cancel: "Close modal" },
            children: (
              <ModalBody>
                <Text size="sm">
                  This action is so important that you are required to confirm
                  it with a modal. Please click one of these buttons to proceed.
                </Text>
              </ModalBody>
            ),
            onConfirm: () =>
              openConfirmModal({
                title: "This is modal at second layer",
                labels: { confirm: "Close modal", cancel: "Back" },
                closeOnConfirm: false,
                children: (
                  <ModalBody>
                    <Text size="sm">
                      When this modal is closed modals state will revert to
                      first modal
                    </Text>
                  </ModalBody>
                ),
                onConfirm: closeAllModals
              })
          })
        }
      >
        Open multiple steps modal
      </Button>
    </>
  );
}
