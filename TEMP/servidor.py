#Este arquivo implementa o lado servidor da aplicação.

from socket import *
from usuario import Usuario
import protocolo_de_comunicacao
import json

#Variável global que representa todos os usuários que estão utilizando a aplicação
gUsuarios = {}

def adicionar_novo_usuario(nome, ip, porta):
    gUsuarios[nome] = Usuario(nome, ip, porta)

def imprimir_usuarios():
    print("\n########## Lista de Usuários ##########")
    for usuario in gUsuarios.values():  usuario.imprimir()
    print("#######################################\n")

#Esta função imprime as mensagens trocadas entre um cliente e o servidor da aplicação
def imprimir_mensagens(mensagem, resposta):
    print("Cliente: \"{0}\"".format(mensagem), flush=True)
    if(resposta != ""): print("Servidor: \"{0}\"".format(resposta), flush=True)

#Esta função realiza o processamento necessário para responder a uma requisição de
#registro enviada por um cliente da aplicação
def processar_requisicao_de_registro(informacoes_da_mensagem):
    nome, ip, porta, socket_id = informacoes_da_mensagem.split(", ")
    if(nome in gUsuarios.keys()):
        return protocolo_de_comunicacao.get_mensagem_do_tipo_erro("$Já há um usuário registrado com esse nome!$" + socket_id)
    adicionar_novo_usuario(nome, ip, porta)
    imprimir_usuarios()
    return protocolo_de_comunicacao.get_mensagem_do_tipo_ok("Novo usuário registrado!$" + json.dumps(gUsuarios[nome].to_json()) + "$" + socket_id)

#Esta função realiza o processamento necessário para responder a uma requisição de
#consulta enviada por um cliente da aplicação
def processar_requisicao_de_consulta(informacoes_da_mensagem):
    nome, socket_id = informacoes_da_mensagem.split("$")
    try:
        usuario = gUsuarios[nome]
        return protocolo_de_comunicacao.get_mensagem_do_tipo_ok("${0}, {1}".format(usuario.ip, usuario.porta) + "$" + socket_id)
    except:
        return protocolo_de_comunicacao.get_mensagem_do_tipo_erro("$Não há nenhum usuário registrado com esse nome!$" + socket_id)

#Esta função realiza o processamento necessário para responder a uma requisição de
#fechamento de conexão enviada por um cliente da aplicação
def processar_requisicao_de_fechamento_de_conexao(informacoes_da_mensagem):
    nome, socket_id = informacoes_da_mensagem.split("$")
    try:
        gUsuarios.pop(nome)
        return protocolo_de_comunicacao.get_mensagem_do_tipo_ok("$Conexão encerrada$" + socket_id + "$" + nome)
    except:
        return

#A cada interação do loop o servidor aguarda uma nova conexão TCP. Ao aceitá-la,
#aguarda o envio de uma requisição do cliente. Ao recebê-la, analisa qual o tipo da
#requisição, realiza o processamento necessário e, envia a resposta adequada ao
#cliente, caso haja. Em seguida encerra a conexão TCP com o cliente
porta_do_servidor = 5000
socket_do_servidor = socket(AF_INET, SOCK_STREAM)
socket_do_servidor.bind(('', porta_do_servidor))
socket_do_servidor.listen(1)
while 1:
    socket_de_conexao, endereco = socket_do_servidor.accept()
    mensagem = socket_de_conexao.recv(1024).decode()
    tipo_de_mensagem = protocolo_de_comunicacao.get_tipo_de_mensagem(mensagem)
    informacoes_da_mensagem = protocolo_de_comunicacao.get_informacoes_da_mensagem(mensagem)
    resposta = ""
    if(tipo_de_mensagem == protocolo_de_comunicacao.MENSAGEM_TIPO_REGISTRAR):
        resposta = processar_requisicao_de_registro(informacoes_da_mensagem)
    elif(tipo_de_mensagem == protocolo_de_comunicacao.MENSAGEM_TIPO_CONSULTAR):
        resposta = processar_requisicao_de_consulta(informacoes_da_mensagem)
    elif(tipo_de_mensagem == protocolo_de_comunicacao.MENSAGEM_TIPO_FECHAR_CONEXAO):
        resposta = processar_requisicao_de_fechamento_de_conexao(informacoes_da_mensagem)
    imprimir_mensagens(mensagem, resposta)
    if(resposta != ""): socket_de_conexao.send(resposta.encode())
    socket_de_conexao.close()
