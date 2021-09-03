"""
O módulo servidor deve:
● Ao iniciar, o módulo servidor da aplicação de ligação inicializa um servidor
de socket UDP usando a porta 6000 e fica esperando pela chegada de mensagens UDP.
● Quando o servidor recebe um “convite” de ligação, é mostrado o convite na tela
e o usuário pode aceitar ou recusar a ligação.
● O módulo servidor responde ao “convite” com uma mensagem “resposta_ao_convite” e
nela envia a palavra “aceito” ou “rejeitado” segundo indicado pelo usuário.
● Também, caso receba um convite de ligação e já esteja em uma conversa com outro cliente,
não é mostrado o convite ao usuário e envia uma “resposta_ao_convite” com a palavra
“rejeitado”, assim quem inicia a ligação é notificado de que o usuário destino está ocupado.
A mensagem “resposta_ao_convite” é enviada usando os dados de endereço recebidos no
“convite”.
● Quando um usuário deseja encerrar a ligação envia uma mensagem “encerrar_ligação” para
o cliente da aplicação de ligação e para de transmitir áudio.
● Quando recebe a mensagem “encerrar_ligação”, para a transmissão de áudio.
"""

from socket import *
import protocolo_ligacao
import threading

def encerrar_ligacao():
    global g_usuario_ocupado
    g_usuario_ocupado = False

def enviar_dados_ligacao():
    print("Ligação Iniciada!")
    import time
    s = 0
    while 1:
        time.sleep(1)
        s = s + 1
        print("PASSARAM-SE {0} SEGUNDOS".format(s))
        if(s == 60):
            encerrar_ligacao()
            break

def iniciar_ligacao():
    global g_usuario_ocupado
    g_usuario_ocupado = True
    threading.Thread(target=enviar_dados_ligacao, daemon=True).start()

def convite_aceito(resposta):
    return protocolo_ligacao.get_informacoes_da_mensagem(resposta) == "Aceito"

def usuario_aceitou_convite(resposta):
    return resposta == "s" or resposta == ""

###QUANDO A GUI ESTIVER FUNCIONANDO ACHO QUE ESSA FUNÇÃO DEVERIA ESTAR NO
###MÓDULO CLIENTE
def mostrar_convite_usuario(dados_convite):
    print("Novo Convite Recebido!")
    print("Nome: {0} IP: {1} Porta: {2}".format(dados_convite[0],
                                                dados_convite[1],
                                                dados_convite[2]))
    return input("Aceitar([s]/n): ")

def processar_convite(mensagem):
    if(g_usuario_ocupado):
        return protocolo_ligacao.get_mensagem_do_tipo_resposta_convite("Rejeitado")
    else:
        informacoes = protocolo_ligacao.get_informacoes_da_mensagem(mensagem).split(", ")
        resposta = mostrar_convite_usuario(informacoes)
        resposta = "Aceito" if(usuario_aceitou_convite(resposta)) else "Rejeitado"
        return protocolo_ligacao.get_mensagem_do_tipo_resposta_convite(resposta)

def executar_servidor():
    IP_SERVIDOR = "localhost"
    #PORTA_SERVIDOR = 6000 #COMENTEI PARA PODER FAZER TESTES NO MESMO COMPUTADOR
    PORTA_SERVIDOR = int(input("PORTA: "))

    socket_servidor = socket(AF_INET, SOCK_DGRAM)
    socket_servidor.bind(("", PORTA_SERVIDOR))
    while 1:
        mensagem, endereco = socket_servidor.recvfrom(1024)
        mensagem = mensagem.decode()
        print("Mensagem Recebida:", mensagem)
        if(protocolo_ligacao.get_tipo_de_mensagem(mensagem) == protocolo_ligacao.MENSAGEM_TIPO_CONVITE):
            resposta = processar_convite(mensagem)
            socket_servidor.sendto(resposta.encode(), endereco)
            print("Resposta Enviada:", resposta)
            if(convite_aceito(resposta)): iniciar_ligacao()
    socket_servidor.close()

g_usuario_ocupado = False
threading.Thread(target=executar_servidor, daemon=True).start()

#    IF USUARIO QUER DESLIGAR: ENVIA PEDIDO DE ENCERRAMENTO DE LIGAÇÃO


