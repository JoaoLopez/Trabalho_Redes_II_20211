from socket import *
import protocolo_de_comunicacao

ip_do_servidor = input("Digite o endereço IP do servidor: ")
porta_do_servidor = 5000

socket_cliente = socket(AF_INET, SOCK_STREAM)
socket_cliente.connect((ip_do_servidor, porta_do_servidor))

usuario_registrado = False
nome_do_usuario = ""
ip_do_usuario = input("Digite seu ip: ")
porta_do_usuario = input("Digite sua porta: ")
while not usuario_registrado:
    nome_do_usuario = input("Digite seu nome: ")    
    mensagem_de_registro = protocolo_de_comunicacao.get_mensagem_do_tipo_registrar((nome_do_usuario, ip_do_usuario, porta_do_usuario))
    socket_cliente.send(mensagem_de_registro)
    mensagem_de_resposta = socket_cliente.recv(1024)
    informacoes_da_resposta = protocolo_de_comunicacao.get_informacoes_da_mensagem(mensagem_de_resposta)
    if(protocolo_de_comunicacao.get_tipo_de_mensagem(mensagem_de_resposta) == protocolo_de_comunicacao.MENSAGEM_TIPO_OK):
        usuario_registrado = True
    else:
        print("Ocorreu um erro durante o registro do usuário.")
        print("Mensagem de erro:", informacoes_da_resposta)

while True:
    nome_do_usuario_a_consultar = ("Informe o nome de um usuário a consultar (ou digite \"quit\" para sair): ")
    if(nome_do_usuario_a_consultar == "quit"):  break
    mensagem_de_consulta = protocolo_de_comunicacao.get_mensagem_do_tipo_consultar(nome_do_usuario_a_consultar)
    socket_cliente.send(mensagem_de_consulta)
    
    mensagem_de_resposta = socket_cliente.recv(1024)
    informacoes_da_resposta = protocolo_de_comunicacao.get_informacoes_da_mensagem(mensagem_de_resposta)
    if(protocolo_de_comunicacao.get_tipo_de_mensagem(mensagem_de_resposta) == protocolo_de_comunicacao.MENSAGEM_TIPO_OK):
        print("Informações do usuário consultado:", informacoes_da_resposta)
    else:
        print("Ocorreu um erro durante a consulta.")
        print("Mensagem de erro:", informacoes_da_resposta)

mensagem_de_fechamento_de_conexao = protocolo_de_comunicacao.get_mensagem_do_tipo_fechar_conexao(nome_do_usuario)
socket_cliente.send(mensagem_de_fechamento_de_conexao)
socket_cliente.close()
