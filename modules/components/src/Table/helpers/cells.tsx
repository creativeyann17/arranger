import { ReactNode } from 'react';
import { css } from '@emotion/react';
import cx from 'classnames';
import filesize from 'filesize';
import { JSONPath } from 'jsonpath-plus';
import { get, isNil } from 'lodash';

import dateFormatter from '@/utils/dates';
import { emptyObj } from '@/utils/noops';

export const getCellValue = (
  row = emptyObj,
  { accessor = '', id = '', jsonPath = '' } = emptyObj,
): string =>
  jsonPath ? JSONPath({ json: row, path: jsonPath }) : get(row, (id || accessor).split('.'), '');

export const getDisplayValue = (row = emptyObj, column = emptyObj): string => {
  const value = getCellValue(row, column);
  switch (column.type) {
    case 'date':
      return dateFormatter(value, column);

    default:
      return value;
  }
};

const Number = (props = emptyObj) => (
  <span
    css={css`
      text-align: right;
    `}
  >
    {props.value?.toLocaleString('en-CA')}
  </span>
);
const FileSize = ({ options = emptyObj, value = 0 }) => <span>{filesize(value, options)}</span>;

export const defaultCellTypes = {
  bits: ({ value = 0, ...props } = emptyObj) => <FileSize {...props} value={value / 8} />,
  boolean: ({ value } = emptyObj) => (isNil(value) ? '' : `${value}`),
  bytes: (props = emptyObj) => <FileSize {...props} />,
  date: ({ value, ...props } = emptyObj) => dateFormatter(value, props),
  list: ({ column, id, value: valuesArr, ...props } = emptyObj) => {
    return Array.isArray(valuesArr) ? (
      <ul className={cx('list-values', column.displayFormat || 'none')}>
        {valuesArr.map((value: ReactNode, index: number) => (
          <li key={`${id}-${index}`} data-value={value}>
            {value}
          </li>
        ))}
      </ul>
    ) : (
      valuesArr
    );
  },
  number: Number,
};