"""
Convidar um usuário:
    Cliente: "Convite: nome_cliente, ip_cliente, porta_cliente"
    Servidor: "Resposta ao Convite: Aceito"
    Servidor: "Resposta ao Convite: Rejeitado"
Enviar dados de voz:
    Cliente: "Dados: dados"
Encerrar uma ligação:
    Cliente: "Encerrar Ligação:"
"""

MENSAGEM_TIPO_CONVITE = 1
MENSAGEM_TIPO_RESPOSTA_CONVITE = 2
MENSAGEM_TIPO_DADOS = 3
MENSAGEM_TIPO_ENCERRAR_LIGACAO = 4

def get_mensagem_do_tipo_convite(informacoes):
    return "Convite: {0}".format(informacoes)

def get_mensagem_do_tipo_resposta_convite(informacoes):
    return "Resposta ao Convite: {0}".format(informacoes)

def get_mensagem_do_tipo_dados(informacoes):
    return "Dados: {0}".format(informacoes)

def get_mensagem_do_tipo_encerrar_ligacao():
    return "Encerrar Ligação:"

def get_informacoes_da_mensagem(mensagem):
    return mensagem[mensagem.find(":") + 1 :].strip()

def get_tipo_de_mensagem(mensagem):
    if(mensagem.startswith("Convite")): return MENSAGEM_TIPO_CONVITE
    if(mensagem.startswith("Resposta ao Convite")): return MENSAGEM_TIPO_RESPOSTA_CONVITE
    if(mensagem.startswith("Dados")): return MENSAGEM_TIPO_DADOS
    if(mensagem.startswith("Encerrar Ligação")): return MENSAGEM_TIPO_ENCERRAR_LIGACAO
