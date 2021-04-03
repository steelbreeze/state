module.exports = {
	out: './docs/api/v8',
	readme: 'none',
	mode: 'file',
	excludeExternals: false,
	excludeNotExported: true,
	excludePrivate: true,
	excludeProtected: true,
	stripInternal: 'true',
	exclude: [
		'**/*Strategy.ts'
	]
};