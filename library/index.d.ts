export declare function build(): Promise<void>
export declare function compile(): Promise<void>
export declare function patch(
	aliases?: Array<{ find: RegExp; replacement: string | null }>
): void
