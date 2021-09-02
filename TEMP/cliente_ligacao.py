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

from socket import *

IP_SERVIDOR_LIGACOES = 'localhost'
PORTA_SERVIDOR_LIGACOES = 6000
socket_cliente = socket(AF_INET, SOCK_DGRAM)

nome_dest_ligacao = input("Para quem você deseja ligar? ")
"""
consultar_usuario()
IP = CONSULTAR_USUARIO()
VERIFICAR error
ENVIAR CONVITE (IP)
RECEBE_RESPOTA()
IF RESPOSTA NEGATIVA ...
ELSE INICIAR_LIGACAO()
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