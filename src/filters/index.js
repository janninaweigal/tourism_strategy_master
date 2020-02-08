/**
 * Copyright (c) dtelec, Inc All Rights Reserved.
 */
import moment from 'moment';

/*
* 日期格式化
*/
export function dateformat(dateStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
	if (!dateStr) {
		return '';
	}
	return moment(dateStr).format(pattern);
}
