import { Operation } from '../enum/operation';

import { createCounter, deleteCounter, enableCounter, manageProjects, resetCounter, undo, updateCounter } from '../flux/action';

import { useAppDispatch, useAppSelector } from '../hook';

import { Counter } from '../model/counter';

import { buildCell, buildRow } from '../util/html';
import { getProjectByName } from '../util/project';

export interface CounterListProps {
	colSpan: number,
	counterList: Counter[],
	projectCurrent: string
}

function CounterList(props: CounterListProps) {

	const dispatch = useAppDispatch();

	const logList = useAppSelector(state => ((((state || {}).reducer || {}).projectList || []).find(getProjectByName(props.projectCurrent)) || { logList: [] }).logList || []);

	let list = [];

	list = [
		buildRow(
			'header',
			buildCell(
				'title',
				<h2>Project {props.projectCurrent}</h2>,
				{ colSpan: props.colSpan - 3 }
			),
			buildCell(
				'reset',
				<input
					className='full_cell_button'
					onClick={() => dispatch(resetCounter())}
					type='button'
					value='Reset'
				/>
			),
			buildCell(
				'create',
				<input
					className='full_cell_button'
					onClick={() => dispatch(createCounter())}
					type='button'
					value='Create'
				/>
			),
			buildCell(
				'back',
				<input
					className='full_cell_button'
					onClick={() => dispatch(manageProjects())}
					type='button'
					value='Back'
				/>
			)
		)
	];

	list = list.concat(
		props.counterList.map((mCounter, i) => buildRow(
			`counter_${i}`,
			buildCell(
				'increment',
				<input
					className={`full_cell_button ${mCounter.isEnabled ? '' : 'hidden'}`}
					id={`increment_${i}_button`}
					onClick={() => dispatch(updateCounter(mCounter.name, Operation.INCREMENT, `increment_${i}_button`))}
					type='button'
					value='Increment'
				/>
			),
			buildCell(
				'name',
				mCounter.name
			),
			buildCell(
				'count',
				mCounter.count,
				{ className: 'count' }
			),
			buildCell(
				'decrement',
				<input
					className={`full_cell_button ${mCounter.isEnabled ? '' : 'hidden'}`}
					id={`decrement_${i}_button`}
					onClick={() => dispatch(updateCounter(mCounter.name, Operation.DECREMENT, `decrement_${i}_button`))}
					type='button'
					value='Decrement'
				/>
			),
			buildCell(
				mCounter.isEnabled ? 'disable' : 'enable',
				<input
					className='full_cell_button'
					onClick={() => dispatch(enableCounter(mCounter.name, !mCounter.isEnabled))}
					type='button'
					value={mCounter.isEnabled ? 'Disable' : 'Enable'}
				/>
			),
			buildCell(
				'delete',
				<input
					className='full_cell_button'
					onClick={() => dispatch(deleteCounter(mCounter.name))}
					type='button'
					value='Delete'
				/>
			)
		))
	);

	if (logList.length > 0) {

		list = list.concat(
			buildRow(
				'log_header',
				buildCell(
					'log_header',
					<h3>Log</h3>,
					{ colSpan: props.colSpan - 1 }
				),
				buildCell(
					'undo_button',
					<input
						className='full_cell_button'
						onClick={() => dispatch(undo())}
						type='button'
						value='Undo'
					/>
				)
			)
		);

		list = list.concat(
			logList.map((mLog, i) => buildRow(
				`log_${i}`,
				buildCell(
					'operation',
					mLog.operation
				),
				buildCell(
					'name',
					mLog.counter.name
				),
				buildCell(
					'count',
					mLog.counter.count,
					{ className: 'count' }
				),
				buildCell(
					'enabled',
					mLog.counter.isEnabled ? 'Enabled' : 'Disabled',
				),
				buildCell(
					'date_time',
					mLog.dateTime,
					{ colSpan: 2 }
				),
			))
		);
	}

	return <>{list}</>;
}

export default CounterList;
