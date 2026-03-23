/* 헬퍼 함수 모듈 */

// 문자열이 유효한지 체크하는 함수
export function isEmpty(str){	
    if(typeof str == "undefined" || str == null || str == "")
        return true;
    else
        return false;
}

export function getFormattedDate() {
    const now = new Date();
    const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()} ${WEEKDAY[now.getDay()]}`;
    // currentDateElement.textContent = dateString;
}