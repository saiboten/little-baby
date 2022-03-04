import { ChakraProvider, Container } from "@chakra-ui/react";

export function ProvidedLoader() {
  return (
    <ChakraProvider>
      <Container
        mt="10"
        border="1px solid"
        borderColor="blue.500"
        padding="5"
        borderRadius="10px"
      >
        Laster
      </Container>
    </ChakraProvider>
  );
}
