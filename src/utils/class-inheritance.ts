import { CONSTANTS } from "src/constants";

export function getInheritedClassByName(obj: any, className: string) {
  let proto = obj.__proto__;
  for (let i = 0; i < 42; i++) {
    if (proto.constructor.name === className) {
      return proto;
    }
    proto = proto.__proto__;
  }
  return false;
}

export function getBaseActorSheet5e(obj: any) {
  return getInheritedClassByName(obj, CONSTANTS.CLASS_ACTOR_SHEET_5E);
}
