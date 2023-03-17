export const byIsEnabledAndName = (counterA, counterB) => {
	if (counterA.isEnabled && (!counterB.isEnabled)) {
		return -1;
	}
	if ((!counterA.isEnabled) && counterB.isEnabled) {
		return 1;
	}
	return counterA.name.localeCompare(counterB.name);
};

export const byNotThisName = name => counter => counter && (counter.name !== name);

export const getCounterByName = name => counter => counter && (counter.name === name);
