"""
● Qualquer usuário registrado pode ligar para outro usuário registrado,
permitindo somente conversação entre dois usuários.
● Qualquer um dos usuários que participam de uma ligação pode encerrar a
ligação.
● O estabelecimento da ligação deve ser feito utilizando-se o protocolo
UDP.
● Os módulos cliente e servidor devem imprimir na tela todas as mensagens
enviadas e recebidas (“convite”, “resposta_ao_convite”, “encerrar_ligação”).
● A aplicação deve ter uma interface gráfica, mesmo sendo simples, seja
intuitiva e satisfaça as funcionalidades da aplicação.

O módulo cliente deve:
● Ao iniciar, deve de inicializar o socket UDP através do qual enviará as mensagens
UDP para o módulo servidor de ligações do usuário com o qual se deseja realizar a
ligação.
● O módulo cliente usa sua funcionalidade do cliente de registro para consultar o
endereço IP do outro usuário. Para isso, deve usar a facilidade “consulta” do módulo
cliente de registro especificando o destinatário da ligação.
● Quando o cliente recebe a resposta com o endereço IP destino, é estabelecida uma
chamada UDP com o par da ligação e é enviado uma mensagem de “convite”. Essa chamada
UDP é realizada para o módulo servidor de ligação que está aguardando a chegada de
mensagens UDP. Na mensagem “convite” é enviado o nome de usuário de quem está iniciando
a ligação, além de seu próprio endereço IP e a porta usada para receber as mensagens UDP.
● Quando recebe uma “resposta_ao_convite”, caso seja “rejeitado”, imprimir na tela a
mensagem “usuário destino ocupado”, caso seja “ aceito”, inicia a coleta e transmissão
Do sinal de áudio pela porta UDP.
● Quando um usuário deseja encerrar a ligação envia uma mensagem “encerrar_ligação”
para o servidor de ligação e para de transmitir áudio.
● Quando recebe a mensagem “encerrar_ligação”, para a transmissão de áudio.
"""
###DEPOIS ESSE ARQUIVO DEVE SER COMBINADO AO ARQUIVO CLIENT.JS!!!!!

################# CÓDIGO DO ARQUIVO CLIENTE.PY - ETAPA 1 #####################
from socket import *
import protocolo_registro

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
    mensagem = protocolo_registro.get_mensagem_do_tipo_registrar("{0}, {1}, {2}".format(nome, ip, porta))
    return mensagem, enviar_mensagem_e_aguardar_resposta(mensagem)
    
def consultar_usuario(nome):
    mensagem = protocolo_registro.get_mensagem_do_tipo_consultar(nome)
    return mensagem, enviar_mensagem_e_aguardar_resposta(mensagem)

def fechar_conexao_com_o_servidor(nome):
    mensagem = protocolo_registro.get_mensagem_do_tipo_fechar_conexao(nome)
    enviar_mensagem(mensagem)
    return mensagem

usuario_registrado = False
nome_do_usuario = ""
ip_do_usuario = input("Digite seu ip: ")
porta_do_usuario = int(input("Digite sua porta: "))
while not usuario_registrado:
    nome_do_usuario = input("Digite seu nome: ")    
    mensagem, resposta = registrar_usuario(nome_do_usuario, ip_do_usuario, porta_do_usuario)
    if(protocolo_registro.get_tipo_de_mensagem(resposta) == protocolo_registro.MENSAGEM_TIPO_OK):
        usuario_registrado = True
    imprimir_mensagens(mensagem, resposta)

#################### FIM CÓDIGO DO ARQUIVO CLIENTE.PY - ETAPA 1 ############################
import protocolo_ligacao
import servidor_ligacao

IP_SERVIDOR_LIGACOES = 'localhost'
PORTA_SERVIDOR_LIGACOES = 6000
socket_cliente = socket(AF_INET, SOCK_DGRAM)
socket_cliente.bind(("", porta_do_usuario))

def enviar_encerramento_ligacao(): pass
def enviar_audio(audio): pass
def gravar_audio(): pass
def reproduzir_audio(): pass
def pedido_encerramento_ligacao(info): pass
def receber_informacoes(): pass

def realizar_ligacao():
    while True:
        info = receber_informacoes()
        if(pedido_encerramento_ligacao(info)): return
        reproduzir_audio(info)
        audio = gravar_audio()
        enviar_audio(audio) #ENVIA O ÁUDIO PARA O SERVIDOR DE LIGAÇÕES DO CLIENTE
        encerrar_ligacao = input("Deseja encerrar a ligação? ")
        if(encerrar_ligacao):
            enviar_encerramento_ligacao()
            return

def get_resposta_convite():
    resposta, endereco = socket_cliente.recvfrom(1024)
    return resposta.decode()

def enviar_convite(nome, ip, porta, ip_dest, porta_dest):
    convite = protocolo_ligacao.get_msg_convite("{0}, {1}, {2}".format(nome, ip, porta))
    socket_cliente.sendto(convite.encode(), (ip_dest, porta_dest))

while True:
    nome_dest_ligacao= input("Para quem você deseja ligar? (digite \"quit\" para sair): ")
    if(nome_dest_ligacao == "quit"):
        mensagem = fechar_conexao_com_o_servidor(nome_do_usuario)
        imprimir_mensagens(mensagem, "")
        break
    mensagem, resposta = consultar_usuario(nome_dest_ligacao)
    imprimir_mensagens(mensagem, resposta)

    if(protocolo_registro.get_tipo_de_mensagem(resposta) == protocolo_registro.MENSAGEM_TIPO_ERRO):
        print("Erro: Usuário não encontrado!")
        continue
    informacoes = protocolo_registro.get_informacoes_da_mensagem(resposta)
    ip_dest, porta_dest = informacoes.split(", ")
    porta_dest = int(porta_dest)
    porta_dest = int(input("porta_dest: "))#6000
    enviar_convite(nome_do_usuario, ip_do_usuario, porta_do_usuario, ip_dest, porta_dest)
    resposta = get_resposta_convite()
    info = protocolo_ligacao.get_info_msg(resposta)
    if(info == "Rejeitado"):
        print("Usuário destino ocupado!")
        continue
    elif(info == "Aceito"):
        import audio
        print("Ligação aceita!")
        import time
        a = time.time()
        while time.time() - a < 1:
            dados, endereco = socket_cliente.recvfrom(4096)
            audio.g_quadros.append(dados)
        print("LENGTH:", len(audio.g_quadros))
        audio.iniciar_reproducao_audio()
        while 1:
            dados, endereco = socket_cliente.recvfrom(4096)
            audio.g_quadros.append(dados)
            print("ÁUDIO RECEBIDO!!!!!!!!")

        #TEMPORARIAMENTE servidor_ligacao.iniciar_ligacao([nome_do_usuario, ip_do_usuario, porta_do_usuario])
        
    


"""
IF RECEBE PEDIDO DE TERMINO() TERMINA LIGACAO
IF QUER TERMINAR() TERMINA LIGACAO




sentence = raw_input('Input lowercase sentence:')

# Envio de bytes. Repare que o endereco do destinatario eh necessario
clientSocket.sendto(sentence, (serverName, serverPort))

# Recepcao
modifiedSentence, addr = clientSocket.recvfrom(1024)
print 'From Server {}: {}'.format(addr, modifiedSentence)

# Fechamento
clientSocket.close()
"""