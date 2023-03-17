import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as colorTheme from '../constant/colorTheme';

import { getLog } from '../util/log';
import { buildCell, buildRow, buildTable } from '../util/html';
import { getProjectByName } from '../util/project';

import { createCounter, createProject, deleteProject, manageCounters, manageProjects, restoreFromLocalStorage, toggleTheme } from '../flux/action';

import './App.css';

const log = getLog('App.');

function setFieldFromState(themeField, theme) {
	if (themeField && (themeField.value !== theme)) {
		themeField.value = theme;
	}
}

function componentDidMount(props, dispatch, themeField, theme) {

	log('componentDidMount', { props, theme });

	dispatch(restoreFromLocalStorage());

	setFieldFromState(themeField, theme);
}

function componentDidUpdate(props, prevProps, dispatch, themeField, theme) {

	log('componentDidUpdate', { props, prevProps, theme });

	setFieldFromState(themeField, theme);

	switch (theme) {

		case colorTheme.DARK:

			document.querySelector(':root').style.setProperty('--page-background-color', '#000000');
			document.querySelector(':root').style.setProperty('--page-text-color', '#959595');
			document.querySelector(':root').style.setProperty('--input-background-color', '#101010');
			document.querySelector(':root').style.setProperty('--input-border-color', '#898989');
			document.querySelector(':root').style.setProperty('--input-text-color', '#ffffff');

			break;

		case colorTheme.LIGHT:

			document.querySelector(':root').style.setProperty('--page-background-color', 'initial');
			document.querySelector(':root').style.setProperty('--page-text-color', 'initial');
			document.querySelector(':root').style.setProperty('--input-background-color', 'initial');
			document.querySelector(':root').style.setProperty('--input-border-color', 'initial');
			document.querySelector(':root').style.setProperty('--input-text-color', 'initial');

			break;

		default: break;
	}
}

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

function App(props) {

	const didMountRef = useRef(false);
	const dispatch = useDispatch();
	const prevProps = usePrevious(props);

	const theme = useSelector(state => ((state || {}).reducer || {}).colorTheme);
	const projectList = useSelector(state => ((state || {}).reducer || {}).projectList || []);
	const projectCurrent = useSelector(state => ((state || {}).reducer || {}).projectCurrent || null);
	const counterList = useSelector(state => ((((state || {}).reducer || {}).projectList || []).find(getProjectByName(projectCurrent)) || { counterList: [] }).counterList || []);

	log('App', { props, theme, projectList, projectCurrent, counterList });

	const [themeField, setThemeField] = useState(null);

	useEffect(() => {
		if (didMountRef.current) {
			componentDidUpdate(props, prevProps, dispatch, themeField, theme);
		} else {
			didMountRef.current = true;
			componentDidMount(props, dispatch, themeField, theme);
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
					{ colSpan: colSpan - 2 }
				),
				buildCell(
					'create',
					<input
						onClick={() => dispatch(createCounter(projectCurrent))}
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
						onClick={() => alert('TO DO')}
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
						onClick={() => alert('TO DO')}
						type='button'
						value='Decrement'
					/>
				),
				buildCell(
					'disable',
					<input
						onClick={() => alert('TO DO')}
						type='button'
						value='Disable'
					/>
				),
				buildCell(
					'delete',
					<input
						onClick={() => alert('TO DO')}
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
