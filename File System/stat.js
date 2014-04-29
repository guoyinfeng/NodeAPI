/**
 * Created by YinFeng-Guo on 14-4-28.
 */
var http = require('http'),
    fs = require('fs');

function loadDirs(callback){
    fs.readdir(
        "albums",
        function(err, files){
            if(err){
                callback(err);
                return;
            }
            var only_dirs = [];
            (function iterator(index){
                if(index == files.length) {
                    callback(null, only_dirs);
                    return;
                }
                fs.stat(
                    "albums/"+files[index],
                    function(err, stats){
                        if(err){
                            callback(err);
                            return;
                        }
                        if(stats.isDirectory()){
                            only_dirs.push(files[index]);
                        }
                        iterator(index+1);
                    }
                );
            })(0);
        }
    );
}

function handle_incoming_request(req, res){
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
var s = http.createServer(handle_incoming_request);
s.listen(8080);
