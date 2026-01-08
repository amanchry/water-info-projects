import {
  Cross2Icon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import DownloadDropDown from "./DownloadDropDown";

function ExpandableCard({
  children,
  title,
  subTitle,
  info,
  className,
  download,
  maxHeight
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <Box
        className={`border border-[var(--gray-4)] bg-white rounded-lg ${className}`}
      >
        <Flex
          className="bg-[var(--gray-3)] rounded-t-lg"
          py="2"
          px="4"
          align="center"
          justify="between"
        >
          <div style={{ fontSize: "16px", fontWeight: 400 }}>
            {title}
          </div>
          <Flex align="center">
            {info && (
              <Flex width="34px" height="34px" align="center">
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <IconButton variant="ghost" size="2" color="gray">
                      <InfoCircledIcon />
                    </IconButton>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[568px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                      <Dialog.Title className="p-4 bg-[var(--blue-2)] border-b border-[var(--gray-4)] rounded-t-md">
                        {title}
                        <p className="text-xs text-gray1 pt-1">{subTitle}</p>
                      </Dialog.Title>

                        <div className="px-4 py-6 text-xs leading-5">

                        {info}
                        </div>
         
                      <Dialog.Close asChild>
                        <button
                          className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                          aria-label="Close"
                        >
                          <Cross2Icon />
                        </button>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </Flex>
            )}
            <Flex width="34px" height="34px" align="center">
              <IconButton
                variant="ghost"
                size="2"
                color="gray"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <EnterFullScreenIcon />
              </IconButton>
            </Flex>
            {download && (
              <Flex width="34px" height="34px" align="center">
                <IconButton
                  variant="ghost"
                  size="2"
                  color="gray"
                  onClick={download}
                >
                  <DownloadDropDown />
                </IconButton>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Box 
        maxHeight={maxHeight}
        overflowY="auto" overflowX="auto" className="custom-scrollbar">
          {children}
        </Box>
      </Box>

      {isExpanded && (
        <>
          <Box
            className="fixed inset-0 bg-black/50 z-60"
            onClick={() => setIsExpanded(false)}
          >
            <Box className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-60 bg-white rounded-lg shadow-lg max-h-[50vh] w-[90vw] max-w-[1200px]">
              <Flex
                className="bg-[var(--gray-3)] rounded-t-lg"
                py="2"
                px="4"
                align="center"
                justify="between"
                
              >
                <div style={{ fontSize: "var(--Font-size-4, 16px)", fontWeight: 400 }}>
                  {title}
                </div>
                <Flex align="center" gap="2">
                  <button
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => setIsExpanded(false)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.0306 5.03068L15.3102 9.75005H17.9999C18.1988 9.75005 18.3896 9.82907 18.5303 9.96972C18.6709 10.1104 18.7499 10.3011 18.7499 10.5001C18.7499 10.699 18.6709 10.8897 18.5303 11.0304C18.3896 11.171 18.1988 11.2501 17.9999 11.2501H13.4999C13.301 11.2501 13.1103 11.171 12.9696 11.0304C12.8289 10.8897 12.7499 10.699 12.7499 10.5001V6.00005C12.7499 5.80114 12.8289 5.61037 12.9696 5.46972C13.1103 5.32907 13.301 5.25005 13.4999 5.25005C13.6988 5.25005 13.8896 5.32907 14.0303 5.46972C14.1709 5.61037 14.2499 5.80114 14.2499 6.00005V8.68974L18.9693 3.96943C19.11 3.8287 19.3009 3.74963 19.4999 3.74963C19.699 3.74963 19.8898 3.8287 20.0306 3.96943C20.1713 4.11016 20.2503 4.30103 20.2503 4.50005C20.2503 4.69907 20.1713 4.88995 20.0306 5.03068ZM10.4999 12.7501H5.99993C5.80102 12.7501 5.61025 12.8291 5.4696 12.9697C5.32895 13.1104 5.24993 13.3011 5.24993 13.5001C5.24993 13.699 5.32895 13.8897 5.4696 14.0304C5.61025 14.171 5.80102 14.2501 5.99993 14.2501H8.68962L3.9693 18.9694C3.82857 19.1102 3.74951 19.301 3.74951 19.5001C3.74951 19.6991 3.82857 19.8899 3.9693 20.0307C4.11003 20.1714 4.30091 20.2505 4.49993 20.2505C4.69895 20.2505 4.88982 20.1714 5.03055 20.0307L9.74993 15.3104V18.0001C9.74993 18.199 9.82895 18.3897 9.9696 18.5304C10.1103 18.671 10.301 18.7501 10.4999 18.7501C10.6988 18.7501 10.8896 18.671 11.0303 18.5304C11.1709 18.3897 11.2499 18.199 11.2499 18.0001V13.5001C11.2499 13.3011 11.1709 13.1104 11.0303 12.9697C10.8896 12.8291 10.6988 12.7501 10.4999 12.7501Z" fill="#60646C" />
                    </svg>
                  </button>
                </Flex>
              </Flex>
              <Box className="h-[calc(100%-50px)] overflow-auto custom-scrollbar"
               maxHeight="400px"
               overflowY="auto" overflowX="auto"
              >{children}</Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default ExpandableCard;
