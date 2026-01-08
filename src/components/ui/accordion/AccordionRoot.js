import { Accordion } from "radix-ui";

function AccordionRoot({ children, ...props }) {
  return <Accordion.Root {...props}>{children}</Accordion.Root>;
}

export default AccordionRoot;
