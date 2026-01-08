import { Accordion } from "radix-ui";   
import { forwardRef } from "react";

const AccordionItem = forwardRef(
	({ children, className, ...props }, forwardedRef) => (
		<Accordion.Item
			className={`mt-px min-w-[200px] overflow-hidden first:mt-0 first:rounded-t last:rounded-b  ${className}`}
			{...props}
			ref={forwardedRef}
		>
			{children}
		</Accordion.Item>
	),
);
AccordionItem.displayName = "AccordionItem";
export default AccordionItem