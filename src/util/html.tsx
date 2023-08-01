import React from "react";

export const buildCell = (key: string, content: any, attributes?: { [key: string]: any; }) => <td
	{...attributes}
	key={key}
>{content}</td>;

export const buildRow = (key: string, ...cellList: any) => <tr
	key={key}
>{cellList}</tr>;

export const buildTable = (parameters: { [key: string]: any; }, ...rowList: any[]) => {
	let key = parameters.key;
	delete parameters.key;
	return <table key={key} {...parameters}><tbody>{rowList}</tbody></table>;
};
