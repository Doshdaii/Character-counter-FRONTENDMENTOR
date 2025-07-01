import React from "react";
import { useState } from "react";
import "./App.css";
import counterLogoDark from "./assets/images/logo-dark-theme.svg";
import counterLogoLight from "./assets/images/logo-light-theme.svg";
import moon from "./assets/images/icon-moon.svg";
import sunshine from "./assets/images/icon-sun.svg";
import seeMoreIcon from "./assets/images/icon-info.svg";
import iconCheck from "./assets/images/icon-check.svg";
import iconInfo from "./assets/images/icon-info.svg";
const App = ({}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [text, setText] = useState("");
  const [showAllLetters, setShowAllLetters] = useState(false);
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [charLimit, setCharLimit] = useState(300);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const getCharacterCount = () => text.length;
  const getWordCount = () => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };
  const getSentenceCount = () => {
    const matches = text.match(/[^.!?]+[.!?]+/g);
    return matches ? matches.length : text.trim() ? 1 : 0;
  };
  const getLetterFrequency = (text) => {
    const counts = {};
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, ""); // remove non-letters
    const totalLetters = cleanText.length;

    for (const char of cleanText) {
      counts[char] = (counts[char] || 0) + 1;
    }

    // convert counts to percentage
    const frequencies = {};
    for (const char in counts) {
      frequencies[char] = {
        count: counts[char],
        percent: ((counts[char] / totalLetters) * 100).toFixed(2),
      };
    }

    return frequencies;
  };
  const letterData = getLetterFrequency(text);

  function toggle() {
    setIsDarkMode(!isDarkMode);
  }

  const handleTextChange = (e) => {
    const newText = e.target.value;

    if (limitEnabled && newText.length >= charLimit) {
      setHasReachedLimit(true);
    } else {
      setHasReachedLimit(false);
    }

    if (!limitEnabled || newText.length <= charLimit) {
      setText(newText);
    }
  };

  const getLinearGradient = (percent) => ({
    background: `linear-gradient(to right, #d3a0fa ${percent}% , #e5e7eb ${percent}%)`,
  });
  const getReadingTime = () => {
    const textLength = text.trim().length;

    if (textLength === 0) return "0 minute";
    if (textLength > 0 && textLength <= 50) return "<1 minute";
  };
  return (
    <div className={isDarkMode ? "general-div dark" : "general-div light"}>
      <nav className="nav-bar">
        <img src={isDarkMode ? counterLogoDark : counterLogoLight} alt="" />
        <img src={isDarkMode ? sunshine : moon} alt="" onClick={toggle} />
      </nav>
      <div className="header">
        <h1>Analyze your text in real-time.</h1>
      </div>
      <div className="text-area">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          className={`${isDarkMode ? "d-textarea" : "l-textarea"} ${
            limitEnabled && hasReachedLimit ? "textarea-error" : ""
          }`}
          onChange={handleTextChange}
          placeholder="Start typing here... (or paste your text)"
        ></textarea>
        <div>
          {limitEnabled && hasReachedLimit && (
            <p
              style={{
                color: "#fe8159",
                marginTop: "8px",
                display: "flex",
                gap: "5px",
              }}
            >
              <img src={iconInfo} alt="" /> Limit reached! Your text exceeds{" "}
              {charLimit}
              characters.
            </p>
          )}
          {/* {limitEnabled && (
            <p>
              Characters: {text.length}/{charLimit}
            </p>
          )} */}
        </div>
        <div className="Info">
          <div className="checkboxes">
            <div className="check">
              <input type="checkbox" id="ES" />
              <label htmlFor="ES"> Exclude Spaces</label>
            </div>
            <div className="check">
              <input
                type="checkbox"
                id="SCL"
                checked={limitEnabled}
                onChange={(e) => {
                  setLimitEnabled(e.target.checked);
                }}
              />
              <label htmlFor="SCL"> Set Character Limits</label>
              {limitEnabled && (
                <input
                  type="text"
                  className="char-limit"
                  value={charLimit}
                  onChange={(e) => {
                    setCharLimit(e.target.value);
                  }}
                />
              )}
            </div>
          </div>
          <p>Approx. reading time: {getReadingTime()}</p>
        </div>
      </div>
      <div>
        <div className="character-Info">
          <div className="total">
            <h1>{getCharacterCount()}</h1>
            <p>Total Character</p>
          </div>
          <div className="word">
            <h1>{getWordCount()}</h1>
            <p>Word Count</p>
          </div>
          <div className="sentence">
            <h1>{getSentenceCount()}</h1>
            <p>Sentence Count</p>
          </div>
        </div>

        <div>
          <h2 className={isDarkMode ? "dark" : "light"}>Letter Density</h2>
          {Object.entries(letterData)
            .sort((a, b) => b[1].count - a[1].count) // sort descending by frequency
            .slice(0, showAllLetters ? 26 : 4) // 26 = all letters
            .map(([letter, data]) => (
              <div className="input-progress-grid" key={letter}>
                <p>{letter.toUpperCase()}</p>
                <input
                  type="range"
                  value={data.percent}
                  max="100"
                  readOnly
                  className="accent"
                  style={getLinearGradient(parseFloat(data.percent))}
                />
                <p className={isDarkMode ? "dark" : "light"}>
                  {data.count} <span>({data.percent}%)</span>
                </p>
              </div>
            ))}

          <h6 className="see-more">
            {showAllLetters ? "Show less" : "See more"}
            <i
              className="fa-solid fa-circle-chevron-down"
              onClick={() => setShowAllLetters(!showAllLetters)}
            ></i>
          </h6>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default App;
