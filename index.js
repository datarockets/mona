/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const env = require('node-env-file');

const Botkit = require('botkit');
const redis = require('botkit-storage-redis');

const nodeEnv = process.env.NODE_ENV || 'development'

if (nodeEnv === 'development') {
  env(__dirname + '/.env');
}

const redisConfig = {

}

const bot_options = {
  scopes: ['bot'],
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  studio_token: process.env.studio_token,
  studio_command_uri: process.env.studio_command_uri,
  storage: redis(redisConfig),
};

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express_webserver.js')(controller);

webserver.get('/', function(req, res){
  res.render('index', {
    domain: req.get('host'),
    protocol: req.protocol,
    glitch_domain:  process.env.PROJECT_DOMAIN,
    layout: 'layouts/default'
  });
})
// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// enable advanced botkit studio metrics
require('botkit-studio-metrics')(controller);

const normalizedPath = require("path").join(__dirname, "skills");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});
