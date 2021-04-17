const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');

const pergunta = require('./database/models/Pergunta');
const resposta = require('./database/models/Resposta');

const app = express();

// Dizendo para o Express usar o EJS como View Engine
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    pergunta.findAll({ raw: true, order: [
        ['id', 'DESC']
    ]}).then((perguntas) => {
        response.render('index', {
            perguntas: perguntas,
        });
    });
});

app.get('/perguntar', (request, response) => {
    response.render('perguntar');
});

app.post('/salvarPegunta', (request, response) => {
    var titulo = request.body.titulo;
    var descricao = request.body.descricao;

    pergunta.create({
        titulo: titulo,
        descricao: descricao,
    }).then(() => {
        response.redirect('/');
    });
});

app.get('/pergunta/:id', (request, response) => {
    var id = request.params.id;

    pergunta.findOne({ 
        where: { id: id }
     }).then((pergunta) => {
        if (pergunta != undefined) {
            resposta.findAll({
                where: { pergunta_id: pergunta.id },
                order: [
                    [ 'id', 'DESC' ]
                ],
            }).then((respostas) => {
                response.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
        } else {
            response.redirect('/');
        };
     });
});

app.post('/responder', (request, response) => {
    var corpo = request.body.corpo;
    var pergunta_id = request.body.pergunta_id;

    resposta.create({
        corpo: corpo,
        pergunta_id: pergunta_id,
    }).then(() => {
        response.redirect('/pergunta/' + pergunta_id);
    });
});

app.listen(3333);
