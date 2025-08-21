"use client";

import { useReservation } from "@/app/_components/ReservationContext";
import {
	differenceInCalendarDays,
	differenceInDays,
	isAfter,
	isBefore,
	isPast,
	isSameDay,
	isWithinInterval,
	startOfDay,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function isAlreadyBooked(range, datesArr) {
	return (
		range.from &&
		range.to &&
		datesArr.some((date) =>
			isWithinInterval(date, { start: range.from, end: range.to })
		)
	);
}

// helpers
const isBooked = (d, bookedDates) => bookedDates.some((b) => isSameDay(b, d));

const createsTooShortRange = (d, displayRange, minBookingLength) => {
	if (!displayRange?.from || displayRange?.to) return false; // only constrain while picking the end date
	const from = startOfDay(displayRange.from);
	const end = startOfDay(d);
	const length = differenceInCalendarDays(end, from); // inclusive
	return length > 0 && length < minBookingLength;
};

const crossesABookedDay = (d, displayRange, bookedDates) => {
	if (!displayRange?.from || displayRange?.to) return false;
	const start = startOfDay(
		isBefore(d, displayRange.from) ? d : displayRange.from
	);
	const end = startOfDay(
		isAfter(d, displayRange.from) ? d : displayRange.from
	);
	return bookedDates.some((b) =>
		isWithinInterval(startOfDay(b), { start, end })
	);
};

function DateSelector({ cabin, bookedDates, settings }) {
	const { range, setRange, resetRange } = useReservation();

	const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

	const { regularPrice, discount } = cabin;
	const numNights = differenceInDays(displayRange.to, displayRange.from);
	const cabinPrice = numNights * (regularPrice - discount);

	// SETTINGS
	const { minBookingLength, maxBookingLength } = settings;

	return (
		<div className="flex flex-col justify-between">
			<DayPicker
				className="pt-12 place-self-center"
				mode="range"
				min={minBookingLength}
				max={maxBookingLength}
				startMonth={new Date()}
				end={new Date().getFullYear() + 5}
				disabled={(curDate) =>
					isPast(curDate) ||
					isBooked(curDate, bookedDates) ||
					createsTooShortRange(
						curDate,
						displayRange,
						minBookingLength
					) ||
					crossesABookedDay(curDate, displayRange, bookedDates)
				}
				iisP
				captionLayout="dropdown"
				onSelect={setRange}
				selected={displayRange}
				numberOfMonths={2}
			/>

			<div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
				<div className="flex items-baseline gap-6">
					<p className="flex gap-2 items-baseline">
						{discount > 0 ? (
							<>
								<span className="text-2xl">
									${regularPrice - discount}
								</span>
								<span className="line-through font-semibold text-primary-700">
									${regularPrice}
								</span>
							</>
						) : (
							<span className="text-2xl">${regularPrice}</span>
						)}
						<span className="">/night</span>
					</p>
					{numNights ? (
						<>
							<p className="bg-accent-600 px-3 py-2 text-2xl">
								<span>&times;</span> <span>{numNights}</span>
							</p>
							<p>
								<span className="text-lg font-bold uppercase">
									Total
								</span>{" "}
								<span className="text-2xl font-semibold">
									${cabinPrice}
								</span>
							</p>
						</>
					) : null}
				</div>

				{range?.from || range?.to ? (
					<button
						className="border border-primary-800 py-2 px-4 text-sm font-semibold"
						onClick={resetRange}
					>
						Clear
					</button>
				) : null}
			</div>
		</div>
	);
}

export default DateSelector;
