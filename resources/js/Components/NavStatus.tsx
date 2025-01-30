import { Link, Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";

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
    return (
        <Navbar
            isBordered
            classNames={{
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
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
                {tabs.map((tab) => {
                    if (tab.notFor != null && tab.notFor()) {
                        return null;
                    }

                    return (
                        <NavbarItem key={tab.name} isActive={currTab === tab.name}>
                            <Link color={currTab === tab.name ? 'primary' : 'foreground'} href="#" onClick={(e) => {
                                e.preventDefault();
                                setCurrTab(tab.name);
                            }}>
                                {tab.label}
                            </Link>
                        </NavbarItem>
                    )
                })}
            </NavbarContent>
        </Navbar>
    )
}

export default NavStatus;
