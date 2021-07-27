from socket import *
import protocolo_de_comunicacao

ip_do_servidor = input("Digite o endereço IP do servidor: ")
porta_do_servidor = 5000

def enviar_mensagem_e_aguardar_resposta(mensagem):
    socket_cliente = socket(AF_INET, SOCK_STREAM)
    socket_cliente.connect((ip_do_servidor, porta_do_servidor))
    socket_cliente.send(mensagem.encode())
    resposta = socket_cliente.recv(1024).decode()
    socket_cliente.close()
    return resposta

def enviar_mensagem(mensagem):
    socket_cliente = socket(AF_INET, SOCK_STREAM)
    socket_cliente.connect((ip_do_servidor, porta_do_servidor))
    socket_cliente.send(mensagem.encode())
    socket_cliente.close()

def imprimir_mensagens(mensagem, resposta):
    print("Cliente: \"{0}\"".format(mensagem))
    if(resposta != ""): print("Servidor: \"{0}\"".format(resposta))

def registrar_usuario(nome, ip, porta):
    mensagem = protocolo_de_comunicacao.get_mensagem_do_tipo_registrar("{0}, {1}, {2}".format(nome, ip, porta))
    return mensagem, enviar_mensagem_e_aguardar_resposta(mensagem)
    
def consultar_usuario(nome):
    mensagem = protocolo_de_comunicacao.get_mensagem_do_tipo_consultar(nome)
    return mensagem, enviar_mensagem_e_aguardar_resposta(mensagem)

def fechar_conexao_com_o_servidor(nome):
    mensagem = protocolo_de_comunicacao.get_mensagem_do_tipo_fechar_conexao(nome)
    enviar_mensagem(mensagem)
    return mensagem

usuario_registrado = False
nome_do_usuario = ""
ip_do_usuario = input("Digite seu ip: ")
porta_do_usuario = input("Digite sua porta: ")
while not usuario_registrado:
    nome_do_usuario = input("Digite seu nome: ")    
    mensagem, resposta = registrar_usuario(nome_do_usuario, ip_do_usuario, porta_do_usuario)
    if(protocolo_de_comunicacao.get_tipo_de_mensagem(resposta) == protocolo_de_comunicacao.MENSAGEM_TIPO_OK):
        usuario_registrado = True
    imprimir_mensagens(mensagem, resposta)

while True:
    nome_do_usuario_a_consultar = input("Informe o nome de um usuário a consultar (ou digite \"quit\" para sair): ")
    if(nome_do_usuario_a_consultar == "quit"):
        mensagem = fechar_conexao_com_o_servidor(nome_do_usuario)
        imprimir_mensagens(mensagem, "")
        break
    mensagem, resposta = consultar_usuario(nome_do_usuario_a_consultar)
    imprimir_mensagens(mensagem, resposta)
