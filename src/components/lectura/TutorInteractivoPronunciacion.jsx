// src/components/lectura/TutorInteractivoPronunciacion.jsx
import { useState, useEffect, useRef } from 'react';
import { MdMic, MdStop, MdVolumeUp, MdCheckCircle, MdPlayArrow, MdReplay } from 'react-icons/md';
import tutorVozService from '../../services/tutorVozService';

export default function TutorInteractivoPronunciacion({
  palabrasParaPracticar = [],
  nombreEstudiante,
  onCompletarPractica,
  onAnalizarPalabra,
}) {
  // Estados principales
  const [palabraActualIndex, setPalabraActualIndex] = useState(0);
  const [estado, setEstado] = useState('preparando'); // preparando, escuchando, listo, grabando, analizando, feedback, completado
  const [grabando, setGrabando] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [resultadoAnalisis, setResultadoAnalisis] = useState(null);
  const [intentos, setIntentos] = useState(0);
  const [palabrasCompletadas, setPalabrasCompletadas] = useState([]);
  const [tutorHablando, setTutorHablando] = useState(false);

  // 🆕 CAMBIO CRÍTICO: Usar ref para acceder a la palabra actual sin problemas de closure
  const palabraActualIndexRef = useRef(palabraActualIndex);
  useEffect(() => {
    palabraActualIndexRef.current = palabraActualIndex;
  }, [palabraActualIndex]);

  const palabraActual = palabrasParaPracticar[palabraActualIndex];

  // Efecto de inicialización
  useEffect(() => {
    if (palabrasParaPracticar.length > 0 && estado === 'preparando') {
      iniciarSesion();
    }
  }, [palabrasParaPracticar]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      tutorVozService.detener();
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  const iniciarSesion = async () => {
    setTutorHablando(true);
    await tutorVozService.saludar(nombreEstudiante);
    await new Promise(resolve => setTimeout(resolve, 500));
    await tutorVozService.explicarPractica();
    setTutorHablando(false);
    setEstado('escuchando');
    await pronunciarPalabraActual();
  };

  // 🆕 CAMBIO CRÍTICO: Modificar para usar el índice actual correctamente
  const pronunciarPalabraActual = async () => {
    // Obtener la palabra usando el ref actualizado
    const indexActual = palabraActualIndexRef.current;
    const palabra = palabrasParaPracticar[indexActual];
    
    if (!palabra) return;
    
    setTutorHablando(true);
    // 🆕 CAMBIO: Usar la variable local 'palabra' en lugar de 'palabraActual' del closure
    await tutorVozService.pronunciarPalabra(palabra.palabra);
    await new Promise(resolve => setTimeout(resolve, 800));
    await tutorVozService.pedirRepetir();
    setTutorHablando(false);
    setEstado('listo');
  };

  const escucharOtraVez = async () => {
    if (tutorHablando) return;
    setEstado('escuchando');
    await pronunciarPalabraActual();
  };

  const dividirEnSilabas = (palabra) => {
    // Algoritmo simple de división silábica en español
    const vocales = 'aeiouáéíóúü';
    const silabas = [];
    let silabaActual = '';
    
    for (let i = 0; i < palabra.length; i++) {
      const char = palabra[i].toLowerCase();
      silabaActual += palabra[i];
      
      // Si es vocal y la siguiente es consonante, cortar
      if (vocales.includes(char) && i < palabra.length - 1) {
        const siguiente = palabra[i + 1].toLowerCase();
        if (!vocales.includes(siguiente)) {
          // Ver si hay dos consonantes juntas
          if (i < palabra.length - 2 && !vocales.includes(palabra[i + 2].toLowerCase())) {
            silabaActual += palabra[i + 1];
            silabas.push(silabaActual);
            silabaActual = '';
            i++;
          } else {
            silabas.push(silabaActual);
            silabaActual = '';
          }
        }
      }
    }
    
    if (silabaActual) {
      silabas.push(silabaActual);
    }
    
    return silabas.length > 0 ? silabas : [palabra];
  };

  const escucharPorSilabas = async () => {
    if (tutorHablando || !palabraActual) return;
    
    setEstado('escuchando');
    setTutorHablando(true);
    
    const silabas = dividirEnSilabas(palabraActual.palabra);
    await tutorVozService.contarSilabas(palabraActual.palabra, silabas);
    
    setTutorHablando(false);
    setEstado('listo');
  };

  const iniciarGrabacion = async () => {
    try {
      if (mediaRecorder?.state === 'recording') {
        mediaRecorder.stop();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
        
        // Analizar automáticamente
        await analizarPronunciacion(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setGrabando(true);
      setEstado('grabando');

      // Auto-detener después de 3 segundos
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setGrabando(false);
        }
      }, 3000);

    } catch (error) {
      console.error('Error al grabar:', error);
      alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
    }
  };

  const detenerGrabacion = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setGrabando(false);
    }
  };

  const analizarPronunciacion = async (blob) => {
    setEstado('analizando');
    
    try {
      // Llamar al backend para analizar la palabra individual
      const resultado = await onAnalizarPalabra(palabraActual.palabra, blob);
      
      setResultadoAnalisis(resultado);
      setIntentos(prev => prev + 1);
      
      // Feedback del tutor
      await darFeedback(resultado);
      
    } catch (error) {
      console.error('Error al analizar:', error);
      setEstado('listo');
    }
  };

  const darFeedback = async (resultado) => {
    setEstado('feedback');
    setTutorHablando(true);
    
    const precision = resultado.precision_global || 0;
    const palabraDicha = resultado.texto_transcrito || '';
    
    if (precision >= 80) {
      // Éxito
      await tutorVozService.celebrarExito();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Marcar como completada
      setPalabrasCompletadas(prev => [...prev, palabraActual.palabra]);
      
      // 🆕 CAMBIO CRÍTICO: Avanzar a la siguiente palabra correctamente
      const siguienteIndex = palabraActualIndexRef.current + 1;
      
      if (siguienteIndex < palabrasParaPracticar.length) {
        // Actualizar el índice
        setPalabraActualIndex(siguienteIndex);
        setIntentos(0);
        setResultadoAnalisis(null);
        setEstado('escuchando');
        
        // Esperar a que React actualice el estado
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Ahora pronunciar la nueva palabra usando el ref actualizado
        await pronunciarPalabraActual();
      } else {
        // Completó todas las palabras
        await new Promise(resolve => setTimeout(resolve, 500));
        await tutorVozService.despedirse(nombreEstudiante || 'Campeón');
        setEstado('completado');
        
        if (onCompletarPractica) {
          onCompletarPractica(palabrasCompletadas.length + 1);
        }
      }
    } else {
      // Puede mejorar, dar feedback específico
      await tutorVozService.animarMejora();
      
      if (palabraDicha && palabraDicha !== palabraActual.palabra) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await tutorVozService.explicarError(palabraActual.palabra, palabraDicha);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setResultadoAnalisis(null);
      setEstado('listo');
    }
    
    setTutorHablando(false);
  };

  const reintentar = () => {
    setResultadoAnalisis(null);
    setAudioBlob(null);
    setEstado('listo');
  };

  if (!palabraActual) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">No hay palabras para practicar en este momento.</p>
      </div>
    );
  }

  const progreso = ((palabraActualIndex + 1) / palabrasParaPracticar.length) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
      {/* Header con progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
            <span className="text-2xl">👩‍🏫</span>
            Tutor de Pronunciación
          </h3>
          <div className="text-sm font-semibold text-purple-600">
            Palabra {palabraActualIndex + 1} de {palabrasParaPracticar.length}
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {estado === 'completado' ? (
        // Pantalla de completado
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-purple-700 mb-2">
            ¡Completaste todas las palabras!
          </h2>
          <p className="text-purple-600 mb-4">
            Practicaste {palabrasCompletadas.length} palabra{palabrasCompletadas.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {palabrasCompletadas.map((p, i) => (
              <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                ✓ {p}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Palabra actual - GRANDE y clara */}
          <div className="bg-white rounded-2xl p-8 mb-6 text-center border-4 border-purple-200 shadow-inner">
            <div className="mb-2">
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                Practica esta palabra:
              </span>
            </div>
            <div className="text-6xl font-black text-purple-700 mb-4 tracking-wide">
              {palabraActual.palabra}
            </div>
            
            {palabraActual.tipo_error && (
              <div className="text-sm text-purple-500">
                Tipo: {palabraActual.tipo_error}
              </div>
            )}
          </div>

          {/* Estado del tutor */}
          {tutorHablando && (
            <div className="bg-pink-100 border-2 border-pink-300 rounded-xl p-4 mb-4 flex items-center gap-3 animate-pulse">
              <MdVolumeUp className="text-3xl text-pink-600" />
              <div>
                <p className="font-bold text-pink-700">La tutora está hablando...</p>
                <p className="text-sm text-pink-600">Escucha con atención 👂</p>
              </div>
            </div>
          )}

          {/* Instrucciones según el estado */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              {estado === 'escuchando' && '👂 Escucha cómo pronuncio la palabra...'}
              {estado === 'listo' && '🎤 ¡Tu turno! Presiona "Estoy listo" para grabar'}
              {estado === 'grabando' && '🔴 ¡Grabando! Di la palabra ahora'}
              {estado === 'analizando' && '🤔 Estoy escuchando tu pronunciación...'}
              {estado === 'feedback' && '💬 Te voy a decir cómo lo hiciste...'}
            </p>
          </div>

          {/* Controles */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Escuchar otra vez */}
            <button
              onClick={escucharOtraVez}
              disabled={tutorHablando || estado === 'grabando' || estado === 'analizando'}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <MdVolumeUp size={24} />
              Escuchar otra vez
            </button>

            {/* Escuchar por sílabas */}
            <button
              onClick={escucharPorSilabas}
              disabled={tutorHablando || estado === 'grabando' || estado === 'analizando'}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <MdPlayArrow size={24} />
              Por sílabas
            </button>
          </div>

          {/* Botón de grabación grande */}
          {estado === 'listo' && !grabando && (
            <button
              onClick={iniciarGrabacion}
              disabled={tutorHablando}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <MdMic size={32} />
              ¡Estoy listo! 🎤
            </button>
          )}

          {grabando && (
            <button
              onClick={detenerGrabacion}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-black shadow-lg animate-pulse flex items-center justify-center gap-3"
            >
              <MdStop size={32} />
              Grabando... Di la palabra
            </button>
          )}

          {/* Resultado del análisis */}
          {resultadoAnalisis && estado === 'feedback' && (
            <div className={`mt-4 rounded-2xl p-6 border-4 ${
              (resultadoAnalisis.precision_global || 0) >= 80 
                ? 'bg-green-50 border-green-300' 
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">
                  {(resultadoAnalisis.precision_global || 0) >= 80 ? '🎉' : '💪'}
                </div>
                <p className="text-2xl font-bold">
                  {(resultadoAnalisis.precision_global || 0) >= 80 
                    ? '¡Perfecto!' 
                    : '¡Buen intento!'}
                </p>
                <p className="text-lg mt-2">
                  Precisión: {(resultadoAnalisis.precision_global || 0).toFixed(0)}%
                </p>
              </div>

              {resultadoAnalisis.texto_transcrito && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Escuché:</p>
                  <p className="text-lg font-bold text-gray-800">
                    "{resultadoAnalisis.texto_transcrito}"
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-600 text-center">
                Intento {intentos} de 3
              </p>
            </div>
          )}

          {/* Palabras completadas */}
          {palabrasCompletadas.length > 0 && (
            <div className="mt-4 pt-4 border-t-2 border-purple-200">
              <p className="text-sm font-semibold text-purple-700 mb-2">
                ✓ Palabras completadas ({palabrasCompletadas.length}):
              </p>
              <div className="flex gap-2 flex-wrap">
                {palabrasCompletadas.map((p, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}