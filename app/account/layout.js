import SideNavigation from "@/app/account/SideNavigation";

export default function AccountLayout({ children }) {
	return (
		<div className="grid grid-cols-[16rem_1fr] h_full gap-12">
			<SideNavigation />
			<div className="py-1">{children}</div>
		</div>
	);
}
