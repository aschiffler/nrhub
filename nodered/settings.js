var log = require("@node-red/util").log;

module.exports = {
    flowFilePretty: true,
    userDir: '/home/vlab-user/node-red/',
    httpAdminRoot: process.env.JUPYTERHUB_SERVICE_PREFIX || '/',
    httpNodeRoot: process.env.JUPYTERHUB_SERVICE_PREFIX || '/',
    externalModules: {
        autoInstall: false,
        palette: {
                allowInstall: false,
                allowUpload: false
        },
        modules: {
                allowInstall: false
        }
   },
   logging: {
         console: {
             level: "info",
             metrics: false,
             audit: false
         }
   },
   editorTheme: {
        header: {
                title: "Node-Red-Hub@vLab",
                url: process.env.HUB_BASE_URL + "/hub/home"
        },
        tours: false,
        projects: {
           enabled: true
       }
   },
   adminAuth: {
    type:"strategy",
    strategy: {
        name: "oauth2",
        label: 'Step in',
        icon:"",
        strategy: require("passport-oauth2").Strategy,
        options: {
          authorizationURL: process.env.HUB_BASE_URL + '/hub/api/oauth2/authorize',
          tokenURL: process.env.JUPYTERHUB_API_URL + '/oauth2/token',
          clientID: process.env.JUPYTERHUB_CLIENT_ID,
	  clientSecret: process.env.JUPYTERHUB_API_TOKEN,
          callbackURL: process.env.JUPYTERHUB_OAUTH_CALLBACK_URL,
            verify: function(token, tokenSecret, profile, done) {
		if (profile.admin == true){
			profile.name = process.env.JUPYTERHUB_USER
		}
                done(null, profile.name);
            }
        },
    },
    users: [
       { username: process.env.JUPYTERHUB_USER ,permissions: ["*"]}
    ]
  }
}
