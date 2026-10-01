# Voiceover (ElevenLabs)

`scripts/tts.mjs` calls `POST /v1/text-to-speech/{voice_id}/with-timestamps` once per scene.
- It passes the neighbouring scenes' text as `previous_text` and `next_text`, so intonation flows across cuts.
- The response carries character-level `alignment`. The script groups the characters into words and writes them as `@remotion/captions` `Caption[]` objects (`text`, `startMs`, `endMs`, `timestampMs`, `confidence`).

## Choosing a voice
- **List voices:**
  ```bash
  curl -s -H "xi-api-key: $ELEVENLABS_API_KEY" https://api.elevenlabs.io/v2/voices?page_size=50 | jq -r '.voices[] | "\(.voice_id)  \(.name)  \(.labels|tostring)"'
  ```
- **Offer 2–3 voices** that match the tone (AskUserQuestion). Generate the hook line with each one so the user can compare them with `afplay`.
- **Defaults:** voice `JBFqnCBsd6RMkjVDRZzb` (George, a warm narrator) and model `eleven_multilingual_v2`.
  - This model supports `previous_text`/`next_text` and is the most stable for long-form.
  - Use `eleven_flash_v2_5` for fast or cheap drafts.
- **Overrides:** set the voice in `storyboard.json` → `voice`, or with the env var `ELEVENLABS_VOICE_ID`.

## Writing for TTS
- Spell numbers and symbols the way they should be spoken: "twenty-four seven", not "24/7"; "A-P-I" vs "API" depending on the brand.
- If the product name gets mispronounced, write it phonetically in `vo` and keep the real spelling in `onScreenText`. The captions show what's spoken, so if captions are on, show `onScreenText` instead.
- Use punctuation for pacing: commas for short pauses, full stops for longer ones. Don't stuff ellipses.
- Keep each scene's VO a complete sentence or clause, so per-scene clips sound natural.

## Iterating
- Edit `vo` in `storyboard.json` and re-run `tts.mjs`. Only the changed scenes are regenerated, since the cache key is voice + model + text.
- If a video runs long, cut words. Don't speed up the audio, because speeding up audio sounds robotic and breaks sync.
- Cost: charged per character. A 30s promo is about 500 characters.
