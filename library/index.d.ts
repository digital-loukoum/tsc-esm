import type { AliasResolver } from "@digitak/grubber/library/utilities/resolveAliases"
export type { AliasResolver }

export declare function build(aliases?: Array<AliasResolver>): Promise<void>
export declare function compile(): Promise<void>
export declare function patch(aliases?: Array<AliasResolver>): Promise<void>
