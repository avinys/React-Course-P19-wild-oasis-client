import { Suspense } from "react";
import CabinList from "./CabinList";
import Spinner from "@/app/_components/Spinner";
import Filter from "@/app/_components/Filter";
import ReservationReminder from "./ReservationReminder";

export const metadata = {
	title: "Cabins",
};

// revalidate every hour (optimal cosidering that the prices will not be updated that often)
// not needed anymore because we use searchParams, making this page dynamically rendered
// export const revalidate = 60 * 60;

export default async function Page({ searchParams }) {
	const filter = searchParams?.capacity ?? "all";
	return (
		<div>
			<h1 className="text-4xl mb-5 text-accent-400 font-medium">
				Our Luxury Cabins
			</h1>
			<p className="text-primary-200 text-lg mb-10">
				Cozy yet luxurious cabins, located right in the heart of the
				Italian Dolomites. Imagine waking up to beautiful mountain
				views, spending your days exploring the dark forests around, or
				just relaxing in your private hot tub under the stars. Enjoy
				nature&apos;s beauty in your own little home away from home. The
				perfect spot for a peaceful, calm vacation. Welcome to paradise.
			</p>
			<div className="flex justify-end mb-8">
				<Filter />
			</div>
			<Suspense fallback={<Spinner />} key={filter}>
				<CabinList filter={filter} />
				<ReservationReminder />
			</Suspense>
		</div>
	);
}
