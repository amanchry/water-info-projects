import { CaretLeftIcon, TriangleLeftIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

function SubSectionContainer({ children, title, section, subsection }) {
  return (
    <Box
      position="absolute"
      inset="0"
      className="bg-white custom-scrollbar"
      p={{sm:"5", initial: "3"}}
      overflowY="auto"
      // display={!isActive ? "none" : "block"}
    >
      <Flex align="center" gap="2" pb="4">
        <Flex align="center">
          <Link href={`/${section}`}  className="no-underline">
          <IconButton
            variant="ghost"
            size="1"
            // onClick={() => setActiveSection("")}
          >
            <CaretLeftIcon width="32" height="32" />
          </IconButton>

          
          </Link>
          
        </Flex>
        <Text size="7" weight="light">
          {title}
        </Text>
      </Flex>
      {children}
    </Box>
  );
}

export default SubSectionContainer;
