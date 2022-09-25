import type { Cup } from '../../models';
import type { CupContent, CupContentInfo } from '../../models/content/cup';
import { formatDate } from '../../utils/format-date';

export const infoConverter = (cup: CupContent): Cup['info'] => {
	const hasRecord =
		cup.info?.record &&
		(['racer', 'time'] as (keyof CupContentInfo['record'])[]).some((k) => !!cup.info?.record[k]);
	const record: Cup['info']['record'] = hasRecord
		? {
				racer: cup.info?.record?.racer,
				time: cup.info?.record?.time,
				date: formatDate(cup.info?.record?.date)
		  }
		: undefined;

	return {
		trackLength: cup.info?.trackLength,
		pitLaneLength: cup.info?.pitLaneLength,
		record
	};
};
