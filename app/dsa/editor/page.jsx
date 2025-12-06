"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const LANGUAGES = {
  javascript: {
    name: "JavaScript",
    defaultCode: `function solution(nums) {
  // Your code here
  return result;
}`,
  },
  python: {
    name: "Python",
    defaultCode: `def solution(nums):
    # Your code here
    return result`,
  },
  java: {
    name: "Java",
    defaultCode: `class Solution {
    public int method(int[] nums) {
        // Your code here
        return result;
    }
}`,
  },
  cpp: {
    name: "C++",
    defaultCode: `class Solution {
public:
    int method(vector<int>& nums) {
        // Your code here
        return result;
    }
};`,
  },
};

// Syntax Highlighter with proper indentation preservation
const highlightCode = (code, language) => {
  const keywords = {
    javascript: {
      keyword: [
        "function",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "return",
        "class",
        "async",
        "await",
        "import",
        "export",
        "default",
      ],
      type: ["String", "Number", "Boolean", "Array", "Object"],
    },
    python: {
      keyword: [
        "def",
        "class",
        "if",
        "else",
        "elif",
        "for",
        "while",
        "return",
        "import",
        "from",
        "async",
        "await",
        "in",
        "and",
        "or",
      ],
      type: ["str", "int", "list", "dict", "tuple", "set"],
    },
    java: {
      keyword: [
        "public",
        "private",
        "static",
        "final",
        "class",
        "interface",
        "void",
        "int",
        "String",
        "if",
        "else",
        "for",
        "while",
        "return",
        "new",
      ],
      type: ["String", "Integer", "Boolean", "List", "Map", "Vector"],
    },
    cpp: {
      keyword: [
        "int",
        "void",
        "class",
        "struct",
        "if",
        "else",
        "for",
        "while",
        "return",
        "auto",
        "const",
        "public",
        "private",
      ],
      type: ["string", "vector", "map", "pair"],
    },
  };

  let highlighted = code;
  const langKeywords = keywords[language] || {};

  // Highlight strings (double quotes)
  highlighted = highlighted.replace(
    /"([^"]*)"/g,
    '<span style="color: #ce9178">"$1"</span>'
  );

  // Highlight strings (single quotes)
  highlighted = highlighted.replace(
    /'([^']*)'/g,
    "<span style=\"color: #ce9178\">'$1'</span>"
  );

  // Highlight comments (// style)
  highlighted = highlighted.replace(
    /\/\/.*$/gm,
    '<span style="color: #6a9955">$&</span>'
  );

  // Highlight comments (# style for Python)
  highlighted = highlighted.replace(
    /^(\s*)#.*$/gm,
    '<span style="color: #6a9955">$&</span>'
  );

  // Highlight comments (/* */ style)
  highlighted = highlighted.replace(
    /\/\*[\s\S]*?\*\//g,
    (match) => `<span style="color: #6a9955">${match}</span>`
  );

  // Highlight keywords
  if (langKeywords.keyword) {
    langKeywords.keyword.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #569cd6"><strong>${keyword}</strong></span>`
      );
    });
  }

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b\d+\b/g,
    '<span style="color: #b5cea8">$&</span>'
  );

  // Highlight operators
  highlighted = highlighted.replace(
    /([=+\-*/<>!&|%])/g,
    '<span style="color: #d4d4d4">$1</span>'
  );

  return highlighted;
};

export default function CodeEditorPage() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGES[language].defaultCode);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [lineNumbers, setLineNumbers] = useState(true);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(LANGUAGES[lang].defaultCode);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${
      language === "javascript"
        ? "js"
        : language === "python"
        ? "py"
        : language === "java"
        ? "java"
        : "cpp"
    }`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded!");
  };

  const handleSaveAsQuestion = () => {
    if (!title.trim()) {
      toast.error("Enter a title");
      return;
    }
    // This could send to API to save as a DSA question
    console.log({ title, description, code, language });
    toast.success("Saved as question!");
  };

  const lines = code.split("\n");

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ backgroundColor: "#1e1e1e" }}
    >
      {/* Header */}
      <div
        className="border-b p-4 flex items-center justify-between flex-wrap gap-4"
        style={{ backgroundColor: "#252526", borderColor: "#3e3e42" }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold" style={{ color: "#ffc01d" }}>
            💻 Code Editor
          </h1>

          {/* Language Selector */}
          <div className="flex gap-2">
            {Object.entries(LANGUAGES).map(([lang, { name }]) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className="px-3 py-1 rounded text-xs font-medium transition"
                style={{
                  backgroundColor: language === lang ? "#ffc01d" : "#3e3e42",
                  color: language === lang ? "#000" : "#d4d4d4",
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size & Line Numbers */}
        <div className="flex items-center gap-3">
          <label
            className="flex items-center gap-2 text-xs"
            style={{ color: "#d4d4d4" }}
          >
            Font:
            <input
              type="range"
              min="10"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-16"
            />
            {fontSize}px
          </label>

          <label
            className="flex items-center gap-2 text-xs"
            style={{ color: "#d4d4d4" }}
          >
            <input
              type="checkbox"
              checked={lineNumbers}
              onChange={(e) => setLineNumbers(e.target.checked)}
            />
            Line Numbers
          </label>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Syntax Highlighted Display */}
          <div
            className="flex-1 overflow-auto font-mono relative"
            style={{
              backgroundColor: "#1e1e1e",
              fontSize: `${fontSize}px`,
            }}
          >
            <div className="flex">
              {/* Line Numbers */}
              {lineNumbers && (
                <div
                  className="text-right pr-4 select-none flex-shrink-0"
                  style={{
                    color: "#6a9955",
                    width: "50px",
                    lineHeight: `${fontSize * 1.6}px`,
                    backgroundColor: "#1a1a1a",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  }}
                >
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
              )}

              {/* Code Display */}
              <div className="flex-1 p-4 overflow-hidden">
                <pre
                  style={{
                    margin: 0,
                    padding: 0,
                    color: "#d4d4d4",
                    lineHeight: `${fontSize * 1.6}px`,
                    whiteSpace: "pre",
                    fontFamily: "'Courier New', monospace",
                    fontSize: `${fontSize}px`,
                  }}
                >
                  <code
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(code, language),
                    }}
                  />
                </pre>
              </div>
            </div>
          </div>

          {/* Editable Textarea Overlay */}
          <textarea
            ref={(el) => {
              if (el) {
                el.style.position = "absolute";
                el.style.top = "0";
                el.style.left = lineNumbers ? "66px" : "0";
                el.style.width = lineNumbers ? "calc(100% - 66px)" : "100%";
                el.style.height = "100%";
                el.style.padding = "16px 16px";
                el.style.margin = "0";
                el.style.border = "none";
                el.style.outline = "none";
                el.style.backgroundColor = "transparent";
                el.style.color = "transparent";
                el.style.caretColor = "#ffc01d";
                el.style.font = `${fontSize}px 'Courier New', monospace`;
                el.style.lineHeight = `${fontSize * 1.6}px`;
                el.style.resize = "none";
                el.style.zIndex = "10";
                el.style.fontFamily = "'Courier New', monospace";
              }
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const textarea = e.target;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newCode =
                  code.substring(0, start) + "\t" + code.substring(end);
                setCode(newCode);
                setTimeout(() => {
                  textarea.selectionStart = textarea.selectionEnd = start + 1;
                }, 0);
              }
            }}
            spellCheck="false"
          />
        </div>

        {/* Right Sidebar - Options */}
        <div
          className="w-80 border-l p-4 overflow-y-auto flex flex-col gap-4"
          style={{
            backgroundColor: "#252526",
            borderColor: "#3e3e42",
          }}
        >
          {/* Save as Question */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#ffc01d" }}>
              Save as Question
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Question Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border"
                style={{
                  backgroundColor: "#1e1e1e",
                  borderColor: "#3e3e42",
                  color: "#d4d4d4",
                }}
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border resize-none"
                rows="3"
                style={{
                  backgroundColor: "#1e1e1e",
                  borderColor: "#3e3e42",
                  color: "#d4d4d4",
                }}
              />
              <button
                onClick={handleSaveAsQuestion}
                className="w-full px-4 py-2 text-xs rounded font-medium transition"
                style={{
                  backgroundColor: "#ffc01d",
                  color: "#000",
                }}
              >
                💾 Save as Question
              </button>
            </div>
          </div>

          {/* Code Actions */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#ffc01d" }}>
              Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleCopyCode}
                className="w-full px-4 py-2 text-xs rounded font-medium transition border"
                style={{
                  backgroundColor: "#1e1e1e",
                  borderColor: "#3e3e42",
                  color: "#d4d4d4",
                }}
              >
                📋 Copy Code
              </button>
              <button
                onClick={handleDownloadCode}
                className="w-full px-4 py-2 text-xs rounded font-medium transition border"
                style={{
                  backgroundColor: "#1e1e1e",
                  borderColor: "#3e3e42",
                  color: "#d4d4d4",
                }}
              >
                ⬇️ Download
              </button>
              <button
                onClick={() => setCode(LANGUAGES[language].defaultCode)}
                className="w-full px-4 py-2 text-xs rounded font-medium transition border"
                style={{
                  backgroundColor: "#1e1e1e",
                  borderColor: "#3e3e42",
                  color: "#d4d4d4",
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Code Stats */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#ffc01d" }}>
              Code Stats
            </h3>
            <div className="space-y-2 text-xs" style={{ color: "#d4d4d4" }}>
              <div className="flex justify-between">
                <span>Lines:</span>
                <span className="font-bold">{lines.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span className="font-bold">{code.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Language:</span>
                <span className="font-bold">{LANGUAGES[language].name}</span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#ffc01d" }}>
              Shortcuts
            </h3>
            <div className="text-xs space-y-1" style={{ color: "#a0a0a0" }}>
              <div>Ctrl+C: Copy</div>
              <div>Ctrl+A: Select All</div>
              <div>Tab: Indent</div>
              <div>Shift+Tab: Unindent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
