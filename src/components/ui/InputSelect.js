// src/components/ui/InputSelect.js
import * as React from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const InputSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  size = "2",
  className,
  disabled = false,
}) => {
  // Handle value change
  const handleValueChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <Select.Root value={value} onValueChange={handleValueChange} size={size} disabled={disabled}>
      <Select.Trigger
        className={
          "inline-flex  items-center justify-between gap-[5px] rounded  px-3 py-1 leading-none hover:bg-mauve3 min-w-[80px] text-gray2 " +
          className
        }
      >
        <Select.Value placeholder={placeholder} />
        {!disabled && <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>}
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
          <Select.Viewport className="p-[5px]">
            
            <Select.Item
              value="All"
              className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[highlighted]:bg-blue-100 data-[highlighted]:outline-none cursor-pointer"
            >
              <Select.ItemText>{placeholder}</Select.ItemText>
              <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                <CheckIcon />
              </Select.ItemIndicator>
            </Select.Item>
            {options.map((option, index) => (
              <Select.Item
                key={index}
                value={typeof option === "object" ? option.value : option}
                className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[highlighted]:bg-blue-100 data-[highlighted]:outline-none cursor-pointer"
              >
                <Select.ItemText>
                  {typeof option === "object" ? option.label : option}
                </Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default InputSelect;
