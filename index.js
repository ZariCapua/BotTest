var botScriptExecutor = require('bot-script').executor;
var scr_config = require('./scr_config.json');


let chat_history = {};
let url = "";
let param = JSON.stringify(chat_history);
let header = {"Content-Type ": "application/json"};


function MessageHandler(context, event) {
	//ScriptHandler(context, event);
	let data = 
	    [{
	    id: 'FAQ_17',
	    categories: 'Investors',
	    questions: 'How much money do I need to invest?',
	    answers: 'The minimum investment is only $100.'
	  },
	    {
	    id: 'FAQ_18',
	    categories: 'Investors',
	    questions: 'What is the return on investment?',
	    answers: 'With Greep, the average return on investment is between 10 to 15%'
	     },
	     {
	    id: 'FAC_20',
	    categories: 'Investors',
	    questions: 'Can you further explain how it works?',
	    answers: 'demo1'
	   },
	   {
	    id: 'FAQ_14',
	    categories: 'Roofies',
	    questions: 'How much can I save when I use solar energy for my home?',
	    answers: 'With solar energy, you can lower your electricity cost by as much as 50% to 100%.'
	    }
	    ] ;
	    
  
	for (var x in data){ //iterate on the JSON Object
	  if (data[x].questions ==  event.message ){ //compare each question to user input
	  //console.log(text[input]);
	  //context.console.log(data[x].answers);
	  chat_history.message = event.message;
	  chat_history.response = data[x].answers;
	  //context.sendResponse(data[x].answers ); //send correspomdimg amswer as Response 
	  context.sendResponse(`question: ${chat_history.message} answer: ${chat_history.response} `);
	  }
	}
	
}






function EventHandler(context, event) {
    context.simpledb.roomleveldata = {};
    MessageHandler(context, event);
}


function ScriptHandler(context, event){
    var options = Object.assign({}, scr_config);
    options.current_dir = __dirname;
    //options.default_message = "Sorry Some Error Occurred.";
    // You can add any start point by just mentioning the <script_file_name>.<section_name>
    // options.start_section = "default.main";
    options.success = function(opm){
        context.sendResponse(JSON.stringify(opm));
    };
    options.error = function(err) {
        console.log(err.stack);
        context.sendResponse(options.default_message);
    };
    botScriptExecutor.execute(options, event, context);
}

function HttpResponseHandler(context, event) {
    if (event.geturl === "http://ip-api.com/json")
        context.sendResponse('This is response from http \n' + JSON.stringify(event.getresp, null, '\t'));
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last sent by:" + JSON.stringify(event.dbval));
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last sent by:" + JSON.stringify(event.dbval));
}

function HttpEndpointHandler(context, event) {
    context.sendResponse('This is response from http \n' + JSON.stringify(event, null, '\t'));
}

function LocationHandler(context, event) {
    context.sendResponse("Got location");
};

exports.onMessage = MessageHandler;
exports.onEvent = EventHandler;
exports.onHttpResponse = HttpResponseHandler;
exports.onDbGet = DbGetHandler;
exports.onDbPut = DbPutHandler;
if (typeof LocationHandler == 'function') { exports.onLocation = LocationHandler; }
if (typeof HttpEndpointHandler == 'function') { exports.onHttpEndpoint = HttpEndpointHandler; }
