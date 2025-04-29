const CODE = {
  OK: 0,
  ERROR: 1,
}
const CODE_DESC = {
  [CODE.OK]: '成功',
  [CODE.ERROR]: '失败',
}

const USER_TYPE = {
  ORDINARY: 0,
  ADMIN: 1,
}
const USER_TYPE_DESC = {
  [USER_TYPE.ORDINARY]: '普通用户',
  [USER_TYPE.ADMIN]: '管理员',
}

const ATTR_TYPE = {
  INPUT: 0,
  MIDDLE: 1,
  OUTPUT: 2,
}
const ATTR_TYPE_DESC = {
  [ATTR_TYPE.INPUT]: '输入属性',
  [ATTR_TYPE.MIDDLE]: '中间属性',
  [ATTR_TYPE.OUTPUT]: '输出属性',
}

const VALUE_TYPE = {
  INT: 0,
  DATE: 1,
  FLOAT: 2,
  STRING: 3,
}
const VALUE_TYPE_DESC = {
  [VALUE_TYPE.INT]: '整数',
  [VALUE_TYPE.DATE]: '日期',
  [VALUE_TYPE.FLOAT]: '浮点数',
  [VALUE_TYPE.STRING]: '字符串',
}

const enums = {
  CODE,
  CODE_DESC,
  USER_TYPE,
  USER_TYPE_DESC,
  ATTR_TYPE,
  ATTR_TYPE_DESC,
  VALUE_TYPE,
  VALUE_TYPE_DESC,
}

export default enums