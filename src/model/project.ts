import { Counter } from './counter';
import { Log } from './log';

export interface Project {
	name: string;
	counterList: Counter[];
	logList: Log[];
}
