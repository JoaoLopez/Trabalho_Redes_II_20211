from socket import *
from usuario import Usuario
import protocolo_de_comunicacao

gUsuarios = {}

def adicionar_novo_usuario(nome, ip, porta):
    gUsuarios[nome] = Usuario(nome, ip, porta)

def imprimir_usuarios():
    print("\n########## Lista de Usuários ##########")
    for usuario in gUsuarios.values():  usuario.imprimir()
    print("#######################################\n")

def imprimir_mensagens(mensagem, resposta):
    print("Cliente: \"{0}\"".format(mensagem))
    if(resposta != ""): print("Servidor: \"{0}\"".format(resposta))

def processar_requisicao_de_registro(informacoes_da_mensagem):
    nome, ip, porta = informacoes_da_mensagem.split(", ")
    if(nome in gUsuarios.keys()):
        return protocolo_de_comunicacao.get_mensagem_do_tipo_erro("Já há um usuário registrado com esse nome!")
    adicionar_novo_usuario(nome, ip, porta)
    imprimir_usuarios()
    return protocolo_de_comunicacao.get_mensagem_do_tipo_ok("Novo usuário registrado!")

def processar_requisicao_de_consulta(nome):
    try:
        usuario = gUsuarios[nome]
        return protocolo_de_comunicacao.get_mensagem_do_tipo_ok("{0}, {1}".format(usuario.ip, usuario.porta))
    except:
        return protocolo_de_comunicacao.get_mensagem_do_tipo_erro("Não há nenhum usuário registrado com esse nome!")

def processar_requisicao_de_fechamento_de_conexao(nome):
    try:
        gUsuarios.pop(nome)
    except:
        return

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
        processar_requisicao_de_fechamento_de_conexao(informacoes_da_mensagem)
    imprimir_mensagens(mensagem, resposta)
    if(resposta != ""): socket_de_conexao.send(resposta.encode())
    socket_de_conexao.close()
