var botScriptExecutor = require('bot-script').executor;
var scr_config = require('./scr_config.json');



let url = "http://mockbin.org/bin/955f6c04-a1f1-4955-a411-74a1cb44aa9f";
let header = {"headers": {
    "cookie": "foo=bar; bar=baz"
  }};

let chat_responses = []; // initialize an array to hold all the chat history objects
function MessageHandler(context, event) {
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
	    ];
	    
  

    for (var x in data) { //iterate on the JSON Object
        if (data[x].questions == event.message) { //compare each question to user input
            let chat_history = {}; // initialize a chat history object for this question
            chat_history.message = event.message;
            chat_history.response = data[x].answers;
            chat_responses.push(chat_history); // add the chat history object to the responses array
            context.sendResponse(data[x].answers);
        }
    }
      
   if (chat_responses.length > 0) { // check if there are any chat history objects
        context.simplehttp.makePost(url,JSON.stringify(chat_responses),header);
    } else {
        context.sendResponse("Please ask a question."); // send a default message if there are no matches
    }
 
}


function HttpResponseHandler(context, event) {
       // context.sendResponse( JSON.stringify(event.getresp, null, '\t'));
        let response= JSON.parse(event.getresp);
        //context.sendResponse(""); // change later to console log
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
