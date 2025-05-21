/**
 * Utility functions for working with sound files
 */

/**
 * Check if a sound file exists and log its MIME type
 * @param {string} url - The URL of the sound file to check
 * @returns {Promise<boolean>} - True if the file exists with a valid audio MIME type
 */
export const checkSoundFile = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      console.error(`Sound file ${url} not found (${response.status})`);
      return false;
    }
    
    const contentType = response.headers.get('content-type');
    console.log(`Sound file ${url} - Content-Type: ${contentType}`);
    
    // Check if the content type is a valid audio type
    const isAudioType = contentType && (
      contentType.startsWith('audio/') || 
      contentType === 'application/octet-stream' // Some servers use this for binary files
    );
    
    if (!isAudioType) {
      console.warn(`Sound file ${url} has invalid Content-Type: ${contentType}`);
    }
    
    return isAudioType;
  } catch (err) {
    console.error(`Error checking sound file ${url}:`, err);
    return false;
  }
};

/**
 * Check all sound files in a sound pack
 * @param {Object} soundPack - A sound pack object with sounds property
 * @param {string} packId - The ID of the sound pack (for logging)
 * @returns {Promise<Object>} - Results of checking each sound
 */
export const validateSoundPack = async (soundPack, packId) => {
  const results = {};
  
  if (!soundPack || !soundPack.sounds) {
    console.error(`Invalid sound pack: ${packId}`);
    return { valid: false };
  }
  
  console.group(`Validating sound pack: ${packId}`);
  
  for (const [soundName, soundPath] of Object.entries(soundPack.sounds)) {
    results[soundName] = await checkSoundFile(soundPath);
  }
  
  console.groupEnd();
  
  // Pack is valid if all sounds are valid
  results.valid = Object.values(results).every(result => result === true);
  
  return results;
};

/**
 * Validate all sound packs in the application
 * @param {Object} allSoundPacks - Object containing all sound packs
 * @returns {Promise<Object>} - Results of validation for each pack
 */
export const validateAllSoundPacks = async (allSoundPacks) => {
  const results = {};
  
  console.group('Sound pack validation');
  console.log('Starting validation of all sound packs...');
  
  for (const [packId, pack] of Object.entries(allSoundPacks)) {
    results[packId] = await validateSoundPack(pack, packId);
  }
  
  // Log overall results
  console.log('Sound pack validation results:', results);
  console.groupEnd();
  
  return results;
};

/**
 * Create Audio object with error handling and fallbacks
 * @param {string} soundPath - Path to the sound file
 * @param {number} volume - Volume level (0-1)
 * @returns {HTMLAudioElement} - Audio element
 */
export const createAudio = (soundPath, volume = 0.3) => {
  const audio = new Audio(soundPath);
  audio.volume = volume;
  
  // Add error event listener
  audio.addEventListener('error', (e) => {
    console.warn(`Error with audio file ${soundPath}:`, e);
  });
  
  return audio;
};

/**
 * Play a sound with fallback to alternative format
 * @param {string} soundPath - Path to the sound file
 * @param {number} volume - Volume level (0-1)
 * @returns {Promise<boolean>} - True if playback started successfully
 */
export const playWithFallback = async (soundPath, volume = 0.3) => {
  try {
    const audio = createAudio(soundPath, volume);
    await audio.play();
    return true;
  } catch (err) {
    console.log(`Playback failed for ${soundPath}:`, err);
    
    // Try alternative extension as fallback
    let altPath;
    if (soundPath.endsWith('.mp3')) {
      altPath = soundPath.replace('.mp3', '.wav');
    } else if (soundPath.endsWith('.wav')) {
      altPath = soundPath.replace('.wav', '.mp3');
    }
    
    if (altPath) {
      try {
        console.log('Attempting fallback with:', altPath);
        const fallbackAudio = createAudio(altPath, volume);
        await fallbackAudio.play();
        return true;
      } catch (fallbackErr) {
        console.error('Fallback audio also failed:', fallbackErr);
      }
    }
    
    return false;
  }
}; 