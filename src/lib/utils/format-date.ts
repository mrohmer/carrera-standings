const MONTHS = [
	'Januar',
	'Februar',
	'März',
	'April',
	'Mai',
	'Juni',
	'Juli',
	'August',
	'September',
	'Oktober',
	'November',
	'Dezember'
];

export const formatDate = (date: Date | string): string | undefined => {
	if (!date) {
		return undefined;
	}
	if (typeof date === 'string') {
		date = new Date(date);
	}
	return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};
