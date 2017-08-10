/**
 * 弹窗提醒工具
 *
 * @author Zhiguo.Chen
 */
"use strict";
import * as Constants from './constants';

function notify (body) {
    /* eslint-disable no-new */
    new Notification(Constants.NOTIFICATION_TITLE_REDISCLIENT, {
        body: body
    })
}

export default notify;