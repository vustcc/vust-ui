/**
 * @file index.ts
 * @description VUST 套件 SDK 公开入口。
 */

export { createSuiteHostBridge } from "./host-bridge";
export { createSuiteBridge } from "./suite-bridge";
export { SECLAB_SUITE_PROTOCOL_VERSION, SUITE_MESSAGE_TYPES } from "./protocol";
export type * from "./types";
