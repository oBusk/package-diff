import { Box, forwardRef, useBoolean } from "@chakra-ui/react";
import { ReactNode } from "react";
import BorderBox, { BorderBoxProps } from "^/components/ui/BorderBox";
import { cx } from "^/lib/cva";
import CollapsableBorderBoxHeader from "./CollapsableBorderBoxHeader";

export interface CollapsableBorderBoxProps extends BorderBoxProps {
    /** Shown next to the `>` togggle button */
    header?: ReactNode;
}

/** A borderbox with a header that has `>` button to collapse the box, hiding `children`. */
const CollapsableBorderBox = forwardRef<CollapsableBorderBoxProps, "div">(
    ({ header, title, children, className, ...props }, ref) => {
        const [isExpanded, setIsExpanded] = useBoolean(true);

        return (
            <BorderBox className={cx("p-0", className)} {...props} ref={ref}>
                <CollapsableBorderBoxHeader
                    isExpanded={isExpanded}
                    toggleIsExpanded={setIsExpanded.toggle}
                >
                    {header}
                </CollapsableBorderBoxHeader>
                {isExpanded ? <Box overflow="auto">{children}</Box> : null}
            </BorderBox>
        );
    },
);

export default CollapsableBorderBox;
