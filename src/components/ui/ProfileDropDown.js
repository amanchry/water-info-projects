import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, Box, Button } from "@radix-ui/themes";

function ProfileDropDown({ children, trigger }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Box>
          {trigger || <Avatar fallback="J" size="3" variant="solid" radius="full" />}
        </Box>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-sm bg-white py-4 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={6}
          align="end"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default ProfileDropDown;
