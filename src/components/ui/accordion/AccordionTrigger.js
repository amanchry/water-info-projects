import { ChevronDownIcon } from "@radix-ui/themes";
import { Accordion } from "radix-ui";
import { forwardRef } from "react";

const AccordionTrigger = forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={`group flex py-3 md:py-2 flex-1 cursor-default items-center justify-between bg-mauve1 px-4 leading-none text-gray2 outline-none hover:bg-mauve2 border-b border-[var(--gray-4)] md:bg-lightGray text-xs
          ${className}`}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon
          className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;
