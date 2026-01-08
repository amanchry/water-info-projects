import { Accordion } from "radix-ui";
import { forwardRef } from "react";

const AccordionContent = forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={`overflow-hidden bg-mauve2 text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown
        ${className}
      `}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-5 py-[15px]">{children}</div>
    </Accordion.Content>
  )
);
AccordionContent.displayName = "AccordionContent";
export default AccordionContent;
