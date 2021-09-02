import pyaudio

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 5

g_pyaudio_instance = None
g_stream_gravacao = None
g_stream_reproducao = None

def inicializar_dispositivo_audio():
    global g_pyaudio_instance, g_stream_gravacao, g_stream_reproducao
    g_pyaudio_instance = pyaudio.PyAudio()
    g_stream_gravacao = g_pyaudio_instance.open(format=FORMAT,
                                                channels=CHANNELS,
                                                rate=RATE, input=True, 
                                                frames_per_buffer=CHUNK)
    g_stream_reproducao = g_pyaudio_instance.open(format=FORMAT,
                                                channels=CHANNELS,
                                                rate=RATE, output=True)
    
def gravar_audio():
    quadros = []
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        dados = g_stream_gravacao.read(CHUNK)
        quadros.append(dados)
    return quadros

def reproduzir_audio(quadros):
    while(len(quadros) > 0):
        dados = quadros.pop(0)
        g_stream_reproducao.write(dados)

def fechar_dispositivo_audio():
    g_stream_gravacao.stop_stream()
    g_stream_reproducao.stop_stream()
    g_stream_gravacao.close()
    g_stream_reproducao.close()
    g_pyaudio_instance.terminate()

