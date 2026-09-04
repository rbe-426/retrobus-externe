export const HIDE_TEMPORARY_ANNIVERSARY_920 = true;
export const ENABLE_TEMPORARY_ANNIVERSARY_920 = !HIDE_TEMPORARY_ANNIVERSARY_920;

export const is920AnniversaryVehiclePageActive = () => {
	const dateParts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Paris',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(new Date());
	const date = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));

	return `${date.year}-${date.month}-${date.day}` === '2026-09-05';
};