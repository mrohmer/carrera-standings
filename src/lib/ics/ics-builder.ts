import ical, { ICalCategory, ICalEventBusyStatus } from 'ical-generator';
import type { Cup } from '$lib/models';
import ms from 'ms';

export const icsBuilder = (name: string, description: string, cups: Cup[]): string => {
	const calendar = ical({
		name,
		description,
		prodId: { company: 'Matthias Rohmer', language: 'DE', product: 'carrera-standings' }
	});

	cups
		.filter(({ date }) => !!date)
		.forEach((cup) => {
			calendar.createEvent({
				start: new Date(cup.date!),
				end: new Date(+new Date(cup.date!) + ms('4h')),
				summary: `${cup.dateFixed ? '' : '* '}CMA ${cup.title}`,
				url: `https://carrera-standings.rohmer.rocks/${new Date(cup.date!).getFullYear()}/cups/${
					cup.slug
				}`,
				busystatus: cup.dateFixed ? ICalEventBusyStatus.BUSY : ICalEventBusyStatus.FREE,
				categories: [
					new ICalCategory({
						name: 'Carrera'
					}),
					new ICalCategory({
						name: 'Rennen'
					})
				]
			});
		});

	return calendar.toString();
};
