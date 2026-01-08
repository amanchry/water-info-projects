import { TriangleLeftIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import { Box, IconButton } from "@radix-ui/themes";
import React from "react";

function CollapsibleLeftDrawer({ children }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  return (
    <Box
      width={isCollapsed ? "0px" : { sm: "50vw", initial: "100vw" }}
      maxWidth={"40vw"}
      height={isCollapsed ? "100%" : {sm:"100%", initial: "40vh"}}
      className="flex-none z-10 transition-all ease-in-out bg-white"
      position={{ sm: "relative", initial: "relative" }}
      // bottom={{initial: "0"}}
      flexGrow={isCollapsed ? "0" : "1"}
      gridRowEnd="1"
    >
      <Box
        as="span"
        position="absolute"
        right="-20px"
        top="50%"
        display={{ sm: "block", initial: "none" }}
      >
        <IconButton
          className=" !bg-white !text-primary3 !py-6 cursor-pointer "
          size="1"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <TriangleLeftIcon /> : <TriangleRightIcon />}
        </IconButton>
      </Box>
      <Box
        position="absolute"
        inset="0"
        p={{ sm: "6", initial: "4" }}
        overflowY="auto"
        className="custom-scrollbar"
        display={isCollapsed ? "none" : "block"}
      >
        {children}
      </Box>
    </Box>
  );
}

export default CollapsibleLeftDrawer;
