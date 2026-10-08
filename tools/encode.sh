#!/usr/bin/env bash
# Encodes out/frames into out/toward-the-light.mp4 with a generated ambient drone (same tones as the site's WebAudio pad).
set -euo pipefail
FPS=${FPS:-24}
N=$(ls out/frames | wc -l); DUR=$(python3 -c "print($N/$FPS)")
ffmpeg -y -loglevel error -f lavfi -i "aevalsrc='0.12*sin(2*PI*55*t)*(0.75+0.25*sin(2*PI*0.05*t))+0.06*(2*abs(2*mod(82.4*t,1)-1)-1)*(0.7+0.3*sin(2*PI*0.08*t))+0.04*sin(2*PI*110.2*t)*(0.7+0.3*sin(2*PI*0.11*t))+0.03*sin(2*PI*164.8*t+sin(2*PI*0.2*t))':s=44100:d=$DUR" \
  -af "lowpass=f=900,volume=1.6,afade=t=in:d=3,afade=t=out:st=$(python3 -c "print($DUR-5)"):d=5" -ac 2 out/amb.m4a
ffmpeg -y -loglevel error -framerate $FPS -i out/frames/f%05d.jpg -i out/amb.m4a -c:v libx264 -pix_fmt yuv420p -crf 27 -preset slow -tune grain \
  -c:a aac -b:a 128k -shortest -movflags +faststart out/toward-the-light.mp4
echo out/toward-the-light.mp4
