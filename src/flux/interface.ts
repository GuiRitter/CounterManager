import { Action as ReduxAction } from '@reduxjs/toolkit';

import { ColorTheme } from '../enum/colorTheme';
import { Operation } from '../enum/operation';

import { Project } from '../model/project';

import { Type } from './type';

export interface Action extends ReduxAction<Type>{};

export interface NameAction extends Action { name: string };

export interface EnableAction extends NameAction { isEnabled: boolean };

export interface OperationAction extends NameAction { operation: Operation };

export interface State {
	colorTheme: ColorTheme;
	projectList: Project[];
	projectCurrent: string | null;
}
