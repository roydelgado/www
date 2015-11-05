function ChatHandler () {
    "use strict";

    this.displayChatPage = function(req, res, next) {
        "use strict";
        
        return res.render('chat');
    }

}

module.exports = ChatHandler;