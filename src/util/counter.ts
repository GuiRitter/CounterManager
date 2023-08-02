import { Counter } from "../model/counter";

export const byIsEnabled = (counter: Counter) => counter.isEnabled;

export const byIsEnabledAndNameAsc = (counterA: Counter, counterB: Counter) => {
	if (counterA.isEnabled && (!counterB.isEnabled)) {
		return -1;
	}
	if ((!counterA.isEnabled) && counterB.isEnabled) {
		return 1;
	}
	return counterA.name.localeCompare(counterB.name);
};

export const byNotThisName = (name: string) => (counter: Counter) => counter && (counter.name !== name);

export const getCounterByName = (name: string) => (counter: Counter) => counter && (counter.name === name);
