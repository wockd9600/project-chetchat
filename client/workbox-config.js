module.exports = {
	// globDirectory: 'src/',
	globPatterns: [
		'**/*.{json,ico,html,png,js,txt,css,svg}'
	],
	swDest: 'service-worker.js', // 빌드된 서비스 워커 파일 경로
	swSrc: 'public/service-worker.js',
	"injectionPoint": "injectionPoint",

	// ignoreURLParametersMatching: [
	// 	/^utm_/,
	// 	/^fbclid$/
	// ]
};