/*
 JavaScript functions for the Fourmilab Calendar Converter

 by John Walker  --  September, MIM
 http://www.fourmilab.ch/documents/calendar/

 This program is in the public domain.
 */

/*  MOD  --  Modulus function which works for non-integers.  */

function mod(a, b) {
	return a - (b * Math.floor(a / b));
}

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

function leap_gregorian(year) {
	return ((year % 4) == 0) &&
		(!(((year % 100) == 0) && ((year % 400) != 0)));
}

//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date

var GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year, month, day) {
	return (GREGORIAN_EPOCH - 1) +
		(365 * (year - 1)) +
		Math.floor((year - 1) / 4) +
		(-Math.floor((year - 1) / 100)) +
		Math.floor((year - 1) / 400) +
		Math.floor((((367 * month) - 362) / 12) +
			((month <= 2) ? 0 :
				(leap_gregorian(year) ? -1 : -2)
				) +
			day);
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

function jd_to_gregorian(jd) {
	var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
		yindex, year, yearday, leapadj;

	wjd = Math.floor(jd - 0.5) + 0.5;
	depoch = wjd - GREGORIAN_EPOCH;
	quadricent = Math.floor(depoch / 146097);
	dqc = mod(depoch, 146097);
	cent = Math.floor(dqc / 36524);
	dcent = mod(dqc, 36524);
	quad = Math.floor(dcent / 1461);
	dquad = mod(dcent, 1461);
	yindex = Math.floor(dquad / 365);
	year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
	if (!((cent == 4) || (yindex == 4))) {
		year++;
	}
	yearday = wjd - gregorian_to_jd(year, 1, 1);
	leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0
		:
		(leap_gregorian(year) ? 1 : 2)
		);
	var month = Math.floor((((yearday + leapadj) * 12) + 373) / 367),
		day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

	return [year, month, day];
}


var PERSIAN_EPOCH = 1948320.5;

//  PERSIAN_TO_JD  --  Determine Julian day from Persian date

function persian_to_jd(year, month, day) {
    return -1+day +
	       ((month<=7) ? 31*(month-1) : 30*(month-1)+6) +
	       PERSIAN_EPOCH-1 + 365*(year-1) + Math.floor((8*year+21)/33);
}

//  JD_TO_PERSIAN  --  Calculate Persian date from Julian day

function jd_to_persian(jd) {
    const divCeil = (a,b) => Math.floor((a+b-1)/b);
    const since   = jd - persian_to_jd(1, 1, 1);
    const y       = 1 + Math.floor((33*since+3)/12053);
    const days    = jd - persian_to_jd(y, 1, 1) + 1;
    const m       = (days <= 186) ? divCeil(days, 31) : divCeil(days - 6, 30);
    const d       = jd - persian_to_jd(y, m, 1) + 1;
    return [y, m, d];
}
