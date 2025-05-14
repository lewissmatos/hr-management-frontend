import { Dispatch, useEffect, useState } from "react";

/**
 * Custom hook to debounce a value.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
const useDebounce = (
	delay = 500,
	defaultInputValue?: string
): [string, Dispatch<string>, string] => {
	const [debouncedValue, setDebouncedValue] = useState("");
	const [input, setInput] = useState(defaultInputValue || "");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(input);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [input, delay]);

	useEffect(() => {
		if (defaultInputValue) {
			setInput(defaultInputValue);
		}
	}, [defaultInputValue]);
	return [debouncedValue, setInput, input];
};

export default useDebounce;
