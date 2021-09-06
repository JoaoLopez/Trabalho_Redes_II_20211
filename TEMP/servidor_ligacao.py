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
import protocolo_ligacao as protocolo
import threading
import audio

def encerrar_ligacao():
    global g_usuario_dest
    g_usuario_dest = None

def emissor_msg_valido(emissor):
    return g_usuario_dest["ip"] == emissor[0] and \
           g_usuario_dest["porta"] == emissor[1]

def ligacao_em_andamento(): return g_usuario_dest

def enviar_dados_ligacao():
    audio.iniciar_gravacao_audio()
    socket_ligacao = socket(AF_INET, SOCK_DGRAM)
    while ligacao_em_andamento():
        if(len(audio.g_quadros) > 0):
            socket_ligacao.sendto(audio.g_quadros.pop(0), (g_usuario_dest["ip"], g_usuario_dest["porta"]))
            print("ÁUDIO ENVIADO!")
    socket_ligacao.close()
    audio.encerrar_gravacao_audio()

def iniciar_ligacao(dados_usuario_destino):
    global g_usuario_dest
    g_usuario_dest = {"nome": dados_usuario_destino[0],
                      "ip": dados_usuario_destino[1],
                      "porta": int(dados_usuario_destino[2])}
    threading.Thread(target=enviar_dados_ligacao, daemon=True).start()

def convite_aceito(resp): return protocolo.get_info_msg(resp) == "Aceito"

###QUANDO A GUI ESTIVER FUNCIONANDO ACHO QUE ESSA FUNÇÃO DEVERIA ESTAR NO
###MÓDULO CLIENTE
"""
def mostrar_convite_usuario(info):
    print("Novo Convite Recebido!")
    print("Nome: {0} IP: {1} Porta: {2}".format(info[0], info[1], info[2]))
    return input("Aceitar([s]/n): ")
"""
g_resp_convite = [None]
def mostrar_convite_usuario(info):
    import cliente, time
    cliente.g_convite_recebido[0] = info
    while g_resp_convite[0] is None: time.sleep(0.1)
    return g_resp_convite

def processar_convite(info):
    def usuario_aceitou_convite(resp): return resp == "s" or resp == ""
    if(ligacao_em_andamento()):
        return protocolo.get_msg_resp_convite("Rejeitado")
    else:
        resposta = mostrar_convite_usuario(info)
        resposta = "Aceito" if(usuario_aceitou_convite(resposta)) else "Rejeitado"
        return protocolo.get_msg_resp_convite(resposta)

def get_info_convite(convite): return protocolo.get_info_msg(convite).split(", ")

def executar_servidor():
    IP_SERVIDOR = "localhost"
    #PORTA_SERVIDOR = 6000 #COMENTEI PARA PODER FAZER TESTES NO MESMO COMPUTADOR
    PORTA_SERVIDOR = int(input("PORTA: "))
    socket_servidor = socket(AF_INET, SOCK_DGRAM)
    socket_servidor.bind(("", PORTA_SERVIDOR))
    while 1:
        mensagem, endereco = socket_servidor.recvfrom(1024)
        mensagem = mensagem.decode()
        print("Mensagem Recebida: {0} Endereço: {1}".format(mensagem, endereco))
        if(protocolo.get_tipo_msg(mensagem) == protocolo.MENSAGEM_CONVITE):
            info = get_info_convite(mensagem)
            resposta = processar_convite(info)
            socket_servidor.sendto(resposta.encode(), endereco)
            print("Resposta Enviada:", resposta)
            if(convite_aceito(resposta)):
                iniciar_ligacao(info)
                ##################import cliente
                #################cliente.realizar_ligacao()
        elif(protocolo.get_tipo_msg(mensagem) == protocolo.MENSAGEM_ENCERRAR_LIGACAO):
            if(ligacao_em_andamento() and emissor_msg_valido(endereco)):
                encerrar_ligacao()
    socket_servidor.close()

g_usuario_dest = None
threading.Thread(target=executar_servidor, daemon=True).start()
