const http=require('http');
const fs=require("fs");
const server=http.createServer((req,res)=>{

    const url=req.url;
    const method=req.method;

    if(req.url==='/'){
        //read message first
        fs.readFile('message.txt','utf-8',(err,data)=>{
        const messages = data ? data.split('\n').filter(m=>m.trim()!==''):[];

           res.setHeader('Content-type','text/html');
           res.end( `
            <div>
                <h2>Messages:</h2>
                 <ul>
                    ${messages.map(msg=>`<li>${msg}</li>`).join('')}
                 </ul>
            </div>

            <form action="/message" method="POST">
                <label>Message:</label>
                <input type="text" name="message"></input>
                <button type="submit">Add</button>
            </form>
            `);
        });
    }
    else if(req.url==='/message' && method==='POST'){
            let body=[];
            
            req.on('data',(chunks)=>{
                body.push(chunks);
            });

            req.on('end',()=>{
                const parsedBody=Buffer.concat(body).toString();//message=Hello
                const message=parsedBody.split("=")[1];

                // Read existing messages
                fs.readFile('message.txt','utf-8',(err,data)=>{
                    let oldMessages=data ? data:"";

                    // Add new message at the TOP
                    const updatedMessages=message + "\n" + oldMessages;

                    fs.writeFile("message.txt",updatedMessages, (err)=>{
                    res.statusCode=302; //redirected
                    res.setHeader('Location','/');
                    res.end();
                });
            });       
        });
    }
    else{
        res.statusCode=404;
        res.end("<h1>Page not found</h1>");     
    }
});

server.listen(3000,()=>{
    console.log("Server is running")
});