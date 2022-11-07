import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    forwardRef,
    IconButton,
    IconButtonProps,
    Tooltip,
    useColorMode,
} from "@chakra-ui/react";

export interface ColorModeToggleProps extends Partial<IconButtonProps> {}

const ColorModeToggle = forwardRef<ColorModeToggleProps, "button">(
    ({ ...props }, ref) => {
        const { colorMode, toggleColorMode } = useColorMode();

        const label = `Switch to ${
            colorMode === "dark" ? "Light Mode" : "Dark Mode"
        }`;

        return (
            <Tooltip label={label}>
                <IconButton
                    onClick={toggleColorMode}
                    aria-label={label}
                    icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                    {...props}
                    ref={ref}
                />
            </Tooltip>
        );
    },
);

export default ColorModeToggle;
