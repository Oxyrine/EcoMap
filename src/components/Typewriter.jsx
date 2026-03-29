import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Typewriter({
  words = ['Hello', 'World'],
  typingSpeed = 100,
  deletingSpeed = 60,
  pauseDuration = 1000,
  cursorColor = 'currentColor',
  cursorWidth = 2,
  className = '',
  loop = true,
}) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing | paused | deleting
  const [cursorVisible, setCursorVisible] = useState(true);
  const timeoutRef = useRef(null);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Typing engine
  useEffect(() => {
    const word = words[wordIdx] || '';

    if (phase === 'typing') {
      if (charIdx < word.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(word.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, typingSpeed);
      } else {
        // Word complete — pause then delete
        timeoutRef.current = setTimeout(() => {
          // If last word and no loop, stay
          if (wordIdx === words.length - 1 && !loop) return;
          setPhase('deleting');
        }, pauseDuration);
      }
    } else if (phase === 'deleting') {
      if (charIdx > 0) {
        timeoutRef.current = setTimeout(() => {
          setCharIdx(c => c - 1);
          setDisplayed(word.slice(0, charIdx - 1));
        }, deletingSpeed);
      } else {
        // Move to next word
        const next = (wordIdx + 1) % words.length;
        setWordIdx(next);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [phase, charIdx, wordIdx, words, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={className}>
      {displayed}
      <span
        className="inline-block align-middle ml-[2px] rounded-sm"
        style={{
          width: `${cursorWidth}px`,
          height: '0.85em',
          background: cursorColor,
          opacity: cursorVisible ? 1 : 0,
          transition: 'opacity 0.1s',
          verticalAlign: 'text-bottom',
        }}
      />
    </span>
  );
}
