import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";

function AuthLayout({ children }) {
  return (
    <div className="!bg-[#FCFCFD] min-h-screen">
      <Flex gap="3" align="center">
        <Box
          className="min-h-screen relative"
          display={{ initial: "none", sm: "block" }}
          width="50%"
        >
          <Image
            src="/images/AuthImage.jpg"
            alt="bg"
            fill
            className="object-cover object-top"
          />
          <Image
            src="/images/Logo_WB_Light.png"
            alt="Logo"
            width={250}
            height={50}
            className="absolute top-10 left-10"
          />
          <div className="absolute bottom-4 left-4 text-white text-[18px]">
            Rhine River delta by{" "}
            <a
              href="https://unsplash.com/@susan_wilkinson"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Susan Wilkinson{" "}
            </a>{" "}
            from{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Upsplash.com
            </a>
          </div>
        </Box>
        {/* <Flex
          className="min-h-screen"
          direction="column"
          justify="center"
          width="100%"
          p="5"
        > */}
        {children}
        {/* </Flex> */}
      </Flex>
    </div>
  );
}

export default AuthLayout;
