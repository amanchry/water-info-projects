import * as React from "react";
import { Collapsible } from "radix-ui";
import {
  RowSpacingIcon,
  Cross2Icon,
  CaretDownIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Box, Flex, IconButton, Text } from "@radix-ui/themes";

function CollapsibleCard({
  iconClass,
  title,
  children,
  snippet,
  link,
  defaultOpen = false,
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Collapsible.Root
      className={`min-w-[280px] max-w-[480px] bg-white my-1 border-b border-gray-200 pb-8 rounded-t-sm  ${
        open ? "h-[100%]" : "h-[20px]"
      }`}
      open={open}
      onOpenChange={setOpen}
    >
      <Collapsible.Trigger asChild >
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center gap-4">
            <span
              className={`text-2xl ${
                !open ? iconClass + " collapsible-icon" : iconClass + "1"
              }`}
            ></span>
            <span className="text-[1rem] leading-[25px] text-[#1C2024]">
              {title}
            </span>
            {/* <Text size="" weight="light">
              {title}
            </Text> */}
          </div>
          <button>
            {!open ? (
              <CaretDownIcon className="w-[24px] h-[24px]" />
            ) : (
              <CaretUpIcon className="w-[24px] h-[24px]" />
            )}
          </button>
        </div>
      </Collapsible.Trigger>
      {open && (
        <>
          <hr className="!text-[#CDCED6] my-6" />
          <div className="text-xs text-[#60646C] min-h-9">{snippet}</div>
          {/* <div>
            <Link
              className="!underline !underline-offset-2 font-dm-sans !text-[12px] !leading-[18px] !tracking-[-0.4px] !text-[#3F7FC0] hover:!bg-transparent hover:!text-[#8cb2d9]"
              href={link}
            >
              Explore more data.
            </Link>
          </div> */}
        </>
      )}
      <Collapsible.Content>
        <div>{children}</div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default CollapsibleCard;
