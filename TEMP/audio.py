import pyaudio, time

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 5

g_pyaudio_instance = None
g_stream_gravacao = None
g_stream_reproducao = None
g_quadros = []

def inicializar_dispositivo_audio():
    global g_pyaudio_instance, g_stream_gravacao, g_stream_reproducao
    g_pyaudio_instance = pyaudio.PyAudio()
    g_stream_gravacao = g_pyaudio_instance.open(format=FORMAT,
                                                channels=CHANNELS,
                                                rate=RATE, input=True, 
                                                frames_per_buffer=CHUNK,
                                                stream_callback=gravar_audio)
    g_stream_gravacao.start_stream()
    time.sleep(1)
    
    g_stream_reproducao = g_pyaudio_instance.open(format=FORMAT,
                                                channels=CHANNELS,
                                                rate=RATE, output=True,
                                                stream_callback=reproduzir_audio)
    
    g_stream_reproducao.start_stream()

g_pyaudio_instance = pyaudio.PyAudio()
def iniciar_gravacao_audio():
    global g_stream_gravacao
    g_stream_gravacao = g_pyaudio_instance.open(format=FORMAT,
                                                channels=CHANNELS,
                                                rate=RATE, input=True, 
                                                frames_per_buffer=CHUNK,
                                                stream_callback=gravar_audio)
    g_stream_gravacao.start_stream()

def iniciar_reproducao_audio():
    global g_stream_reproducao
    g_stream_reproducao = g_pyaudio_instance.open(format=FORMAT,
                                                channels=CHANNELS,
                                                rate=RATE, output=True,
                                                stream_callback=reproduzir_audio)
    
    g_stream_reproducao.start_stream()

def gravar_audio(in_data, frame_count, time_info, status_flags):
    g_quadros.append(in_data)
    return (None, pyaudio.paContinue)

def reproduzir_audio(in_data, frame_count, time_info, status):
    data = g_quadros.pop(0)
    if len(g_quadros) != 0: return (data, pyaudio.paContinue)
    else: return (data, pyaudio.paComplete)

def fechar_dispositivo_audio():
    g_stream_gravacao.stop_stream()
    g_stream_reproducao.stop_stream()
    g_stream_gravacao.close()
    g_stream_reproducao.close()
    g_pyaudio_instance.terminate()

def encerrar_gravacao_audio():
    g_stream_gravacao.stop_stream()
    g_stream_gravacao.close()

def encerrar_reproducao_audio():
    g_stream_reproducao.stop_stream()
    g_stream_reproducao.close()
    
def fazer_ligacao():
    import time
    #inicializar_dispositivo_audio()
    iniciar_gravacao_audio()
    time.sleep(1)
    print(len(g_quadros))
    iniciar_reproducao_audio()
    #quadros = gravar_audio()
    time.sleep(60)
    #reproduzir_audio(quadros)
    fechar_dispositivo_audio()

#fazer_ligacao()

