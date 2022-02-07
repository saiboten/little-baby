import "../styles/globals.css";
import { ChakraProvider, Link, Container, Box } from "@chakra-ui/react";
import NextLink from "next/link";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Container
        mt="10"
        border="1px solid"
        borderColor="blue.500"
        padding="5"
        borderRadius="10px"
      >
        <NextLink href="/">
          <Link>Tilbake til forsiden</Link>
        </NextLink>
        <Box mb="5" />
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}

export default MyApp;
