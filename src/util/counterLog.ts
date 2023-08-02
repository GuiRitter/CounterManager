import { Operation } from '../enum/operation';

import { Counter } from '../model/counter';
import { Log } from '../model/log';

const moment = require('moment');

export const byDateTimeDesc = (logA: Log, logB: Log) => logB.dateTime.localeCompare(logA.dateTime);

export const byNotFirst = (_: Log, index: number) => index !== 0;

export const getListAppendedAndSorted = (list: Log[], counter: Counter, operation: Operation, sort: boolean = true) => {

	const listNew = list.concat({
		counter,
		operation,
		dateTime: moment().format()
	});

	return sort ? listNew.sort(byDateTimeDesc) : listNew;
};
