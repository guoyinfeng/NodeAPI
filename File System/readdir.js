/**
 * Created by YinFeng-Guo on 14-4-28.
 */
var http = require('http'),
    fs = require('fs');

function loadDirs(callback){
    fs.readdir(
        "../../nodeapi",
        function(err, files){
            if(err){
                callback(err);
                return;
            }
            callback(null, files);
        }
    );
}

function handle_incoming_requests(req, res){
    loadDirs(function(err, files){
        if(err){
            res.writeHead(503, {"content-type":"application/json"});
            res.send(JSON.stringify(err)+"\n");
            return;
        }

        var out = {error:null,
                    data:{files:files}};
        res.writeHead(200, {"content-type":"application/json"});
        res.end(JSON.stringify(out)+"\n");
    });
}

var s = http.createServer(handle_incoming_requests);
s.listen(8000);
