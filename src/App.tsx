import "./styles.css";
import {
  ChakraProvider,
  Text,
  Button,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react";
import { ModalsProvider } from "./modal-manager/ModalsProvider";
import { Demo } from "./Demo";
import { ContextModalProps } from "./modal-manager";
import { useState } from "react";

const TestModal = ({
  context,
  id,
  innerProps
}: ContextModalProps<{ modalBody: string }>) => {
  const [loading, setLoading] = useState(false);
  const onConfirm = () => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    }).then(() => {
      context.closeModal(id);
    });
  };

  return (
    <>
      <ModalBody>
        <Text size="sm">{innerProps.modalBody}</Text>
      </ModalBody>
      <ModalFooter>
        <Button width="full" mt="md" onClick={onConfirm} isLoading={loading}>
          Close modal
        </Button>
      </ModalFooter>
    </>
  );
};

export default function App() {
  return (
    <ChakraProvider>
      <ModalsProvider modals={{ demonstration: TestModal }}>
        <Demo />
      </ModalsProvider>
    </ChakraProvider>
  );
}
