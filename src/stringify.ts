import { ICustomStringify, IType, ITypedValue } from './types';

const convertType = (obj: unknown): ITypedValue => {
	if (obj === null) {
		return { t: 'null' };
	}
	if (obj === undefined) {
		return { t: 'undefined' };
	}
	if (obj instanceof Date) {
		return { t: 'Date', v: obj.toISOString() };
	}
	switch (typeof obj) {
		case 'string':
			return { t: 'string', v: obj };
		case 'number':
			return { t: 'number', v: obj.toString() };
		case 'boolean':
			return { t: 'boolean', v: obj ? '1' : '0' };
		case 'bigint':
			return { t: 'bigint', v: obj.toString() };
	}
	throw new Error(`Unknown datatype: ${typeof obj}`);
};

const decent = <T extends string = IType>(obj: unknown, customStringify?: ICustomStringify<T>): unknown => {
	if (customStringify) {
		const tmpObj = customStringify(obj);
		if (tmpObj !== undefined) {
			return tmpObj;
		}
	}
	if (Array.isArray(obj)) {
		return obj.map((obj) => decent(obj, customStringify));
	} else if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
		const tmpObj: { [key: string]: unknown } = {};
		for (const [key, value] of Object.entries(obj)) {
			tmpObj[key] = decent(value, customStringify);
		}
		return tmpObj;
	}
	return convertType(obj);
};

export const stringify = <T = unknown, U extends string = IType>(
	obj: T,
	customStringify?: ICustomStringify<U>
): string => {
	return JSON.stringify(decent(obj, customStringify));
};
