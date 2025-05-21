# Sound Pack Instructions

This directory contains sound effects for the quiz application. The current structure is:

```
sounds/
├── quiz_correct.wav   # Default correct answer sound
├── quiz_wrong.wav     # Default wrong answer sound
├── quiz_skip.wav      # Default skip question sound
├── hover.wav          # Default button hover sound
└── packs/
    ├── minimal/       # Minimal sound pack
    │   ├── correct.wav
    │   ├── wrong.wav
    │   ├── skip.wav
    │   └── hover.wav
    ├── retro/         # Retro 8-bit sound pack
    │   ├── correct.wav
    │   ├── wrong.wav
    │   ├── skip.wav
    │   └── hover.wav
    └── nature/        # Nature sound pack
        ├── correct.wav
        ├── wrong.wav
        ├── skip.wav
        └── hover.wav
```

## Sources for Free Sound Effects

You can replace the placeholder files with actual sound effects. Here are some sources for royalty-free sounds:

1. [Freesound](https://freesound.org/) - Collaborative database of Creative Commons Licensed sounds
2. [Mixkit](https://mixkit.co/free-sound-effects/) - Free sound effects with simple licensing
3. [ZapSplat](https://www.zapsplat.com/) - Free sound effects library
4. [SoundBible](https://soundbible.com/) - Free sound clips and effects

## Recommended Sound Characteristics

### Standard Pack (Default)
- **correct.wav**: Clear, positive feedback sound (e.g., bell or success chime)
- **wrong.wav**: Gentle negative feedback (e.g., error tone)
- **skip.wav**: Neutral transition sound
- **hover.wav**: Subtle click or pop

### Minimal Pack
- Softer, more subtle versions of standard sounds
- Low-key and professional

### Retro Pack
- 8-bit style game sounds
- Reminiscent of classic video games

### Nature Pack
- Organic, natural sounds
- Examples:
  - **correct.wav**: Bird chirp or pleasant nature sound
  - **wrong.wav**: Gentle rustling leaves or water drop
  - **skip.wav**: Wind chime or gentle swoosh
  - **hover.wav**: Soft click or leaf rustle

## Converting Sound Formats

For best browser compatibility, use WAV or MP3 formats. To convert sound files:

```bash
# Using ffmpeg (if installed):
ffmpeg -i input.mp3 output.wav
```

## Volume Considerations

The application sets volume programmatically, but it's best to normalize your sound files:
- Keep similar volumes across packs
- Avoid extremely loud or quiet sounds
- Test with headphones to ensure comfortable listening levels 