"use client";

import { createContext, use, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

export function ReservationProvider({ children }) {
	const [range, setRange] = useState(initialState);
	const resetRange = () => {
		setRange(initialState);
	};

	return (
		<ReservationContext.Provider value={{ range, setRange, resetRange }}>
			{children}
		</ReservationContext.Provider>
	);
}

export function useReservation() {
	const context = use(ReservationContext);
	if (context === undefined)
		throw new Error(
			"ReservationContext was used outside of ReservationProvider"
		);
	return context;
}
