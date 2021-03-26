import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D>();
  const [video, setVideo] = useState<HTMLVideoElement>();

  const FRAME_RATE = 30;
  let time = 0;
  let globalFrame = 0;
  let isStarted = false;

  const showFrame = (frame: number, _video?: HTMLVideoElement) => {
    context.clearRect(0, 0, ref.current.width, ref.current.height);
    const element = _video || video;
    time = frame / FRAME_RATE;
    element.currentTime = time;
    console.log(element.currentTime, time, frame);
    context.drawImage(element, 0, 0, ref.current.width, ref.current.height);
  };

  const rendere = (frame: number) => {
    if (!isStarted) {
      return;
    }
    showFrame(frame);
    const next = frame + 1;
    requestAnimationFrame(() => {
      rendere(next);
    });
  };

  const next = () => {
    globalFrame += 1;
    showFrame(globalFrame);
  };

  const play = () => {
    if (!video) {
      console.error('not set video ref');
      return;
    }
    isStarted = true;
    const frame = 0;
    rendere(frame);
  };

  const stop = () => {
    isStarted = false;
  };

  const load = (file: File) => {
    const path = URL.createObjectURL(file);
    const v = document.createElement('video');

    v.src = path;
    v.width = ref.current.width;
    v.height = ref.current.height;

    v.onloadeddata = () => {
      setVideo(v);
      showFrame(0, v);
    };
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files.length) {
      console.error('not set asset');
      return;
    }
    load(e.currentTarget.files[0]);
  };

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    setContext(ctx);
  }, [ref]);

  return (
    <div>
      <main>
        {/* <div className="p-10 max-w-7xl bg-gray-800">
          <div className="relative" style={{ paddingTop: '60%' }}> */}
        <canvas ref={ref} className="bg-gray-800" width="1280" height="720">
          Canvas viewer
        </canvas>
        {/* </div>
        </div> */}
        <p>
          <input type="file" onChange={handleChange} />
        </p>
        <p>
          <button onClick={play}>再生</button>
        </p>
        <p>
          <button onClick={stop}>ストップ</button>
        </p>
        <p>
          <button onClick={next}>次のフレームへ</button>
        </p>
      </main>
    </div>
  );
}
