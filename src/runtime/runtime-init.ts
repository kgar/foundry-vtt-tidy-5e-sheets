import { ItemFilterRuntime } from "./item/ItemFilterRuntime";
import { SheetPreferencesRuntime } from "./user-preferences/SheetPreferencesRuntime";

export function initRuntime() {
    ItemFilterRuntime.init();
    SheetPreferencesRuntime.init();
}