import { buildCell, buildRow, buildTable } from '../util/html';

import { useAppDispatch } from '../hook';

import { createProject, deleteProject, manageCounters } from '../flux/action';

import { Project } from '../model/project';

export interface ProjectListProps {
	colSpan: number,
	projectList: Project[]
}

function ProjectList(props: ProjectListProps) {

	const dispatch = useAppDispatch();

	let list = [
		buildRow(
			'header',
			buildCell(
				'header',
				<h2>Projects</h2>,
				{ colSpan: props.colSpan - 1 }
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
		props.projectList.map((project, i) => buildRow(
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
	
	return <>{list}</>;
}

export default ProjectList;
