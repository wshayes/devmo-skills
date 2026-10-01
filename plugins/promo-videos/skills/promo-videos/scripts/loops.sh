#!/usr/bin/env bash
# GarageBand / Logic Apple Loops -> background music bed.
#   loops.sh genres                         list genre folders
#   loops.sh list [query]                   list loops matching a case-insensitive query
#   loops.sh bed <seconds> <out.mp3> <loop.caf> [loop.caf ...]
#       repeats each loop to <seconds>, mixes them, fades in/out, normalizes loudness.
set -euo pipefail
ROOT="${APPLE_LOOPS_DIR:-/Library/Audio/Apple Loops/Apple}"

need_loops() {
  [[ -d "$ROOT" ]] && return
  echo "No Apple Loops at '$ROOT'. Install GarageBand and download its sound library" >&2
  echo "(GarageBand > Sound Library > Download All), set APPLE_LOOPS_DIR, or use music.mjs." >&2
  exit 3
}

case "${1:-}" in
  genres) need_loops; ls "$ROOT" ;;
  list) need_loops; find "$ROOT" -type f \( -name '*.caf' -o -name '*.aif*' \) | grep -i -- "${2:-}" | sed "s|^$ROOT/||" | sort ;;
  bed)
    [[ $# -ge 4 ]] || { echo "usage: loops.sh bed <seconds> <out.mp3> <loop.caf>..." >&2; exit 2; }
    secs=$2 out=$3; shift 3
    args=() n=0
    for f in "$@"; do
      [[ -f "$f" ]] || f="$ROOT/$f" # accept paths relative to ROOT (as printed by `list`)
      args+=(-stream_loop -1 -i "$f"); n=$((n+1))
    done
    fade_start=$(awk -v s="$secs" 'BEGIN{print (s>3 ? s-2 : s*0.7)}')
    ffmpeg -hide_banner -loglevel error -y "${args[@]}" -t "$secs" \
      -filter_complex "amix=inputs=$n:normalize=0,afade=t=in:d=0.5,afade=t=out:st=$fade_start:d=2,loudnorm=I=-20:TP=-2" \
      -ar 44100 -b:a 192k "$out"
    echo "wrote $out (${secs}s, $n loop(s))"
    ;;
  *) sed -n '2,6p' "$0" >&2; exit 2 ;;
esac
