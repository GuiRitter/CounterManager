import React, { useEffect, useRef, useState } from 'react';

import { ColorTheme } from '../enum/colorTheme';
import { Operation } from '../enum/operation';

import { createCounter, createProject, deleteCounter, deleteProject, enableCounter, manageCounters, manageProjects, resetCounter, restoreFromLocalStorage, toggleTheme, updateCounter } from '../flux/action';

import { useAppDispatch, useAppSelector } from '../hook';

import { AppDispatch } from '../store';

import { getLog } from '../util/log';
import { buildCell, buildRow, buildTable } from '../util/html';
import { getProjectByName } from '../util/project';

import './App.css';

const log = getLog('App.');

function setFieldFromState(themeField: HTMLSelectElement, theme: ColorTheme) {
	if (themeField && (themeField.value !== theme)) {
		themeField.value = theme;
	}
}

function componentDidMount(dispatch: AppDispatch, themeField: HTMLSelectElement, theme: ColorTheme) {

	log('componentDidMount', { theme });

	dispatch(restoreFromLocalStorage());

	setFieldFromState(themeField, theme);
}

function componentDidUpdate(themeField: HTMLSelectElement, theme: ColorTheme) {

	log('componentDidUpdate', { theme });

	setFieldFromState(themeField, theme);

	const root = document.querySelector(':root');

	if (!root) {
		return;
	}

	const htmlElement = root as HTMLHtmlElement;

	switch (theme) {

		case ColorTheme.DARK:

			htmlElement.style.setProperty('--page-background-color', '#000000');
			htmlElement.style.setProperty('--page-text-color', '#959595');
			htmlElement.style.setProperty('--input-background-color', '#101010');
			htmlElement.style.setProperty('--input-border-color', '#898989');
			htmlElement.style.setProperty('--input-text-color', '#ffffff');

			break;

		case ColorTheme.LIGHT:

			htmlElement.style.setProperty('--page-background-color', 'initial');
			htmlElement.style.setProperty('--page-text-color', 'initial');
			htmlElement.style.setProperty('--input-background-color', 'initial');
			htmlElement.style.setProperty('--input-border-color', 'initial');
			htmlElement.style.setProperty('--input-text-color', 'initial');

			break;

		default: break;
	}
}

function App() {

	const didMountRef = useRef(false);
	const dispatch = useAppDispatch();

	const theme = useAppSelector(state => ((state || {}).reducer || {}).colorTheme);
	const projectList = useAppSelector(state => ((state || {}).reducer || {}).projectList || []);
	const projectCurrent = useAppSelector(state => ((state || {}).reducer || {}).projectCurrent || null);
	const counterList = useAppSelector(state => ((((state || {}).reducer || {}).projectList || []).find(getProjectByName(projectCurrent)) || { counterList: [] }).counterList || []);

	log('App', { theme, projectList, projectCurrent, counterList });

	const [themeField, setThemeField] = useState(null as unknown as HTMLSelectElement);

	useEffect(() => {
		if (didMountRef.current) {
			componentDidUpdate(themeField, theme);
		} else {
			didMountRef.current = true;
			componentDidMount(dispatch, themeField, theme);
		}
	});

	const colSpan = projectCurrent ? 6 : 3;

	let list = [];

	if (projectCurrent) {
		list = [
			buildRow(
				'header',
				buildCell(
					'title',
					<h2>Project {projectCurrent}</h2>,
					{ colSpan: colSpan - 3 }
				),
				buildCell(
					'reset',
					<input
						onClick={() => dispatch(resetCounter())}
						type='button'
						value='Reset'
					/>
				),
				buildCell(
					'create',
					<input
						onClick={() => dispatch(createCounter())}
						type='button'
						value='Create'
					/>
				),
				buildCell(
					'back',
					<input
						onClick={() => dispatch(manageProjects())}
						type='button'
						value='Back'
					/>
				)
			)
		];

		list = list.concat(
			counterList.map((counter, i) => buildRow(
				`counter_${i}`,
				buildCell(
					'increment',
					<input
						className={counter.isEnabled ? '' : 'hidden'}
						id={`increment_${i}_button`}
						onClick={() => dispatch(updateCounter(counter.name, Operation.INCREMENT, `increment_${i}_button`))}
						type='button'
						value='Increment'
					/>
				),
				buildCell(
					'name',
					counter.name
				),
				buildCell(
					'count',
					counter.count,
					{ className: 'count' }
				),
				buildCell(
					'decrement',
					<input
						className={counter.isEnabled ? '' : 'hidden'}
						id={`decrement_${i}_button`}
						onClick={() => dispatch(updateCounter(counter.name, Operation.DECREMENT, `decrement_${i}_button`))}
						type='button'
						value='Decrement'
					/>
				),
				buildCell(
					counter.isEnabled ? 'disable' : 'enable',
					<input
						onClick={() => dispatch(enableCounter(counter.name, !counter.isEnabled))}
						type='button'
						value={counter.isEnabled ? 'Disable' : 'Enable'}
					/>
				),
				buildCell(
					'delete',
					<input
						onClick={() => dispatch(deleteCounter(counter.name))}
						type='button'
						value='Delete'
					/>
				)
			))
		)
	} else {
		list = [
			buildRow(
				'header',
				buildCell(
					'header',
					<h2>Projects</h2>,
					{ colSpan: colSpan - 1 }
				),
				buildCell(
					'create',
					<input
						onClick={() => dispatch(createProject())}
						type='button'
						value='Create'
					/>
				)
			)
		];

		list = list.concat(
			projectList.map((project, i) => buildRow(
				`project_${i}`,
				buildCell(
					'project',
					project.name
				),
				buildCell(
					'manage',
					<input
						onClick={() => dispatch(manageCounters(project.name))}
						type='button'
						value='Manage'
					/>
				),
				buildCell(
					'delete',
					<input
						onClick={() => dispatch(deleteProject(project.name))}
						type='button'
						value='Delete'
					/>
				)
			))
		);
	}

	return buildTable(
		{},
		buildRow(
			'title',
			buildCell(
				'title',
				<h1>Counter Manager</h1>,
				{ colSpan }
			)
		),
		list,
		buildRow(
			'footer',
			buildCell(
				'theme',
				<div
					className='footer'
				><select
					onChange={() => dispatch(toggleTheme())}
					ref={ref => { if (ref && (ref !== themeField)) { setThemeField(ref); } }}
				><option>Light</option><option>Dark</option></select><p
					className='by'
				>by Guilherme Alan Ritter</p></div >,
				{ colSpan }
			)
		)
	);
}

export default App;
