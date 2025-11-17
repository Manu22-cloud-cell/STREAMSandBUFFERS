const http=require('http');
const fs=require("fs");
const server=http.createServer((req,res)=>{

    const url=req.url;
    const method=req.method;

    if(req.url==='/'){
        //read message first
        fs.readFile('message.txt',(err,data)=>{
        let message=data||"";
           res.setHeader('Content-type','text/html');
           res.end(
            `
            <h2>Last Message:</h2>
            <p>${message}</p>
            <form action="/message" method="POST">
            <label>Message:</label>
            <input type="text" name="message"></input>
            <button type="submit">Add</button>
            </form>` 
        );
        });
    }
    else{
        if(req.url==='/message'){
            res.setHeader('Content-type','text/html');

            let body=[];
            req.on('data',(chunks)=>{
                body.push(chunks);
            });

            req.on('end',()=>{
                let buffer=Buffer.concat(body);
                let formData=buffer.toString();
                const message=formData.split("=")[1];

                fs.writeFile("message.txt",message,(err)=>{
                    res.statusCode=302; //redirected
                    res.setHeader('Location','/');
                    res.end();
                })
            });
        }
        else{
            if(req.url==='/read'){
                //read from the file
                fs.readFile('message.txt',(err,data)=>{
                    res.end(
                        `<h1>${data.toString()}</h1>`
                    );
                })
            }

        }
    }
})

server.listen(3000,()=>{
    console.log("Server is running")
})