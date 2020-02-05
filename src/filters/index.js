/**
 * Copyright (c) dtelec, Inc All Rights Reserved.
 */
import miment from 'miment';

/*
* 日期格式化
*/
export function dateformat(dateStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
	if (!dateStr) {
		return '';
	}
	return miment(dateStr).format(pattern);
}
