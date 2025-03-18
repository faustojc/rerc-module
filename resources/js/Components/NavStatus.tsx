import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import { useMemo, useState } from "react";
import useIsMobile from "@/Hooks/useIsMobile";
import { CloseToMenuTransition, MenuToCloseTransition } from "@/Components/Icons";

interface NavTab {
    name: string;
    label: string;
    notFor?: () => boolean;
}

interface NavStatusProps {
    currTab: string;
    setCurrTab: (tab: string) => void;
    tabs: NavTab[];
}

const NavStatus = ({currTab, setCurrTab, tabs}: NavStatusProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [otherTabs, setOtherTabs] = useState<NavTab[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const isMobile = useIsMobile();

    const displayTabs = useMemo(() => {
        if (!isMobile) return tabs;

        const filteredTabs = tabs.filter(t => !t.notFor);

        if (tabs.length > 2 && filteredTabs.length !== 0) {
            const other = tabs.filter((t) => t.notFor || !filteredTabs.includes(t));

            other.push(filteredTabs.pop()!);

            setOtherTabs(other);
            return filteredTabs;
        }

        return tabs;
    }, [tabs, isMobile]);

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "sm:justify-start",
                    "justify-between",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px]",
                    "data-[active=true]:after:rounded-[2px]",
                    "data-[active=true]:after:bg-primary",
                ],
            }}
        >
            <NavbarContent className="flex gap-4" justify="start">
                {displayTabs.map((tab) => {
                    if (tab.notFor != null && tab.notFor()) {
                        return null;
                    }

                    return (
                        <NavbarItem key={tab.name} isActive={currTab === tab.name}>
                            <Button color={currTab === tab.name ? 'primary' : 'default'}
                                    onPress={() => setCurrTab(tab.name)}
                                    variant="light"
                                    disabled={currTab === tab.name}
                            >
                                {tab.label}
                            </Button>
                        </NavbarItem>
                    )
                })}
            </NavbarContent>
            {isMobile && otherTabs.length > 0 && (
                <Dropdown onOpenChange={setIsOpen}>
                    <DropdownTrigger>
                        <Button isIconOnly variant="light">
                            {isOpen ? <MenuToCloseTransition /> : <CloseToMenuTransition />}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Other tabs" items={otherTabs}>
                        {(tab) => {
                            if (tab.notFor != null && tab.notFor()) {
                                return null;
                            }

                            return (
                                <DropdownItem
                                    key={tab.label}
                                    className={currTab === tab.name ? "text-primary" : ""}
                                    onPress={() => setCurrTab(tab.name)}
                                >
                                    {tab.label}
                                </DropdownItem>
                            )
                        }}
                    </DropdownMenu>
                </Dropdown>
            )}
        </Navbar>
    )
}

export default NavStatus;
