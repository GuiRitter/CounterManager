import { Operation } from '../enum/operation';
import { Counter } from '../model/counter';

export interface Log {
	// TODO refactor in the future to use the list of these objects to derive the final state of each counter instead of mutating a single counter object for each counter
	counter: Counter;
	operation: Operation;
	dateTime: string;
}
