export const getLog = (file: string) => (title: string, data: any) => console.log((new Date()).toISOString(), file + title, data);
