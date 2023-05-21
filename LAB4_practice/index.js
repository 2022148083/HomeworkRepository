const exp = require("constants");
const express = require("express");

const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.post("/write-file", function(req, res){
    console.log(req.body);

    if (!req.body?.content){
        res.status(400).send("400 에러! content가 post body에 없습니다.");
        return;
    }

    fs.writeFile("test.txt", req.body.content, function(error, data){
        if(error){
            res.status(500).send("500 서버 에러!");
        } else{
            res.status(201).send("파일 생성 성공!");
        }
    });
});

app.get("/read-file", function(req, res){
    console.log(req.query);

    if(!req.query?.file){
        res.status(400).send("400 에러! file이 query parameters에 없습니다.");
        return;
    }

    fs.readFile(req.query.file, "utf-8", async function(error, data){
        if (error){
            if(error.code === "ENOENT"){
                res.status(404).send('${req.query.file}이 없습니다.');
            } else{
                res.status(500).send("500 서버 에러!");
            }
        } else{
            res.status(200).send(data.toString());
        }
    });
});


app.get("/", (req, res) => {
    res.send("Hello World~!");
});

app.get("/posts", function(req, res){
    res.json([
        { postId: 1, title:"Hello" },
        { postId: 2, title:"World" },
    ]);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("서버가 실행됐습니다.");
    console.log(`서버주소: http://localhost:${PORT}`);

});
