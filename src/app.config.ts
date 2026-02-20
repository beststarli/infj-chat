export default defineAppConfig({
	pages: [
		'pages/index/index',
		'pages/intro/index',
		'pages/user/index'
	],
	window: {
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#fff',
		navigationBarTitleText: '绿老头对话模拟器',
		navigationBarTextStyle: 'black'
	},
	tabBar: {
		color: '#94a3b8',
		selectedColor: '#16a34a',
		backgroundColor: '#ffffff',
		borderStyle: 'black',
		list: [
			{
				pagePath: 'pages/index/index',
				text: '首页'
			},
			{
				pagePath: 'pages/intro/index',
				text: '介绍'
			},
			{
				pagePath: 'pages/user/index',
				text: '用户'
			}
		]
	}
})
