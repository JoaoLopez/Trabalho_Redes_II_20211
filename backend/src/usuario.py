#Este arquivo define a classe Usuario que será utilizada pelo servidor
#para representar cada um dos usuários da aplicação.
class Usuario:
    def __init__(self, nome, ip, porta):
        self.__nome = nome
        self.__ip = ip
        self.__porta = porta
    
    def imprimir(self):
        print("Nome: {0}    IP: {1}    Porta: {2}".format(self.nome, self.ip, self.porta))

    @property
    def nome(self):
        return self.__nome
    
    @property
    def ip(self):
        return self.__ip

    @property
    def porta(self):
        return self.__porta

    def to_json(self):
        return { 'name': self.nome, 'ip': self.ip, 'port': self.porta }
