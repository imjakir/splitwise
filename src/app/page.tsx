"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_ROOMMATES = ["You", "Roommate 1", "Roommate 2"];
const ROOMMATE_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
];

const QUICK_SPLITS = [
  { name: "50/50", split: [0.5, 0.5] },
  { name: "70/30", split: [0.7, 0.3] },
  { name: "60/40", split: [0.6, 0.4] },
  { name: "33/33/33", split: [0.33, 0.33, 0.34] },
];

function getInitialRoommates() {
  return DEFAULT_ROOMMATES.map((name, index) => ({ 
    name, 
    color: ROOMMATE_COLORS[index % ROOMMATE_COLORS.length] 
  }));
}

function getInitialItems() {
  return [
    { 
      name: "", 
      price: "", 
      assigned: [0, 1, 2, 3], 
      isCommon: true
    },
  ];
}

function sanitizeAssigned(items, roommatesLength) {
  return items.map(item => ({
    ...item,
    assigned: item.assigned.filter(idx => idx < roommatesLength)
  }));
}

export default function Home() {
  const [roommates, setRoommates] = useState(getInitialRoommates());
  const [items, setItems] = useState(getInitialItems());
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setItems(prev => sanitizeAssigned(prev, roommates.length));
  }, [roommates.length]);

  useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Apply theme
    document.documentElement.classList.toggle('light-mode', !prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-mode', isDarkMode);
  };

  const handleRoommateNameChange = (idx, value) => {
    setRoommates((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, name: value } : r))
    );
  };

  const handleItemChange = (idx, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAssignmentChange = (itemIdx, roommateIdx) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIdx) return item;
        const assigned = item.assigned.includes(roommateIdx)
          ? item.assigned.filter((id) => id !== roommateIdx)
          : [...item.assigned, roommateIdx];
        return {
          ...item,
          assigned,
          isCommon: assigned.length === roommates.length,
        };
      })
    );
  };

  const handleCommonChange = (itemIdx, checked) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIdx) return item;
        return {
          ...item,
          assigned: checked ? roommates.map((_, idx) => idx) : [],
          isCommon: checked,
        };
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { 
        name: "", 
        price: "", 
        assigned: roommates.map((_, idx) => idx), 
        isCommon: true
      },
    ]);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    setRoommates(getInitialRoommates());
    setItems(getInitialItems());
    setCopied(false);
  };

  const applyQuickSplit = (itemIdx, splitIndex) => {
    if (roommates.length < 2) return;
    
    const split = QUICK_SPLITS[splitIndex].split;
    // Only use as many split values as we have roommates (up to split.length)
    const effectiveSplit = split.slice(0, Math.min(split.length, roommates.length));
    
    setItems(prev => 
      prev.map((item, i) => {
        if (i !== itemIdx) return item;
        return {
          ...item,
          isCommon: false,
          assigned: effectiveSplit.map((_, idx) => idx)
        };
      })
    );
  };

  const calcOwes = () => {
    const owes = Array(roommates.length).fill(0);
    items.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      if (price > 0 && item.assigned.length > 0) {
        const share = price / item.assigned.length;
        item.assigned.forEach((idx) => {
          if (roommates[idx]) {
            owes[idx] += share;
          }
        });
      }
    });
    return owes;
  };

  const owes = calcOwes();
  const total = owes.reduce((a, b) => a + b, 0);

  const getSummaryText = () => {
    let text = `Roomie Bill Splitter\n\nTotal: ₹${total.toFixed(2)}\n`;
    owes.forEach((amt, idx) => {
      if (roommates[idx]) {
        text += `\n${roommates[idx].name}: ₹${amt.toFixed(2)}`;
      }
    });
    text += "\n\nItems:";
    items.forEach((item) => {
      if (!item.name && !item.price) return;
      const assignedNames = item.assigned
        .map((idx) => roommates[idx]?.name)
        .filter(Boolean)
        .join(", ");
      text += `\n${item.name || "(no name)"} - ₹${item.price || "0"} [${assignedNames}]`;
    });
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 sm:p-6 md:p-8">
      <div className="max-w-xl mx-auto">
        <div className="card space-y-8 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-end">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-[var(--background)] transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Roomie Bill Splitter</h1>
            <p className="text-[var(--muted)] text-sm sm:text-base">
              Easily split bills among roommates. Add items, assign who pays, and get a shareable summary!
            </p>
          </div>

          {/* Roommates Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Roommates</h2>
              <button
                type="button"
                className="btn flex items-center gap-1"
                onClick={() => {
                  setRoommates(prev => {
                    const newRoommates = [
                      ...prev,
                      { 
                        name: `Roommate ${prev.length + 1}`,
                        color: ROOMMATE_COLORS[prev.length % ROOMMATE_COLORS.length]
                      }
                    ];
                    setItems(items =>
                      items.map(item =>
                        item.isCommon
                          ? { ...item, assigned: newRoommates.map((_, idx) => idx) }
                          : item
                      )
                    );
                    return newRoommates;
                  });
                }}
              >
                <span className="text-xl">+</span>
                <span>Add Roommate</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {roommates.map((r, idx) => (
                <input
                  key={idx}
                  className="input text-center"
                  value={r.name}
                  style={{ 
                    borderLeft: `4px solid ${r.color}`,
                  }}
                  onChange={(e) => handleRoommateNameChange(idx, e.target.value)}
                  onFocus={() => {
                    if (r.name === (DEFAULT_ROOMMATES[idx] || `Roommate ${idx + 1}`)) {
                      handleRoommateNameChange(idx, "");
                    }
                  }}
                  onBlur={e => {
                    if (e.target.value.trim() === "") {
                      handleRoommateNameChange(idx, DEFAULT_ROOMMATES[idx] || `Roommate ${idx + 1}`);
                    }
                  }}
                  maxLength={20}
                />
              ))}
            </div>
          </section>

          {/* Bill Items Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bill Items</h2>
              <button className="btn text-sm" onClick={addItem}>
                + Add Item
              </button>
            </div>
            <AnimatePresence>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] space-y-3 shadow-md"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        className="input"
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                        maxLength={30}
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]">₹</span>
                        <input
                          className="input pl-7"
                          placeholder="Price"
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-[var(--border)]"
                          checked={item.isCommon}
                          onChange={(e) => handleCommonChange(idx, e.target.checked)}
                        />
                        <span>Split equally among all</span>
                      </label>
                      
                      {!item.isCommon && (
                        <>
                          <div className="mb-2">
                            <p className="text-xs text-[var(--muted)] mb-1">Quick Split:</p>
                            <div className="flex flex-wrap gap-2">
                              {QUICK_SPLITS.map((split, splitIdx) => (
                                <button
                                  key={splitIdx}
                                  className="px-2 py-1 text-xs rounded bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                                  onClick={() => applyQuickSplit(idx, splitIdx)}
                                >
                                  {split.name}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {roommates.map((r, rIdx) => (
                              <label 
                                key={rIdx} 
                                className="flex items-center gap-2 text-sm p-1 rounded hover:bg-[var(--background)] transition-colors"
                                style={{
                                  borderLeft: item.assigned.includes(rIdx) ? `2px solid ${r.color}` : '2px solid transparent'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-[var(--border)]"
                                  checked={item.assigned.includes(rIdx)}
                                  onChange={() => handleAssignmentChange(idx, rIdx)}
                                />
                                <span 
                                  className="truncate"
                                  style={{ color: item.assigned.includes(rIdx) ? r.color : 'inherit' }}
                                >
                                  {r.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {items.length > 1 && (
                      <button
                        className="text-sm text-red-500 hover:underline"
                        onClick={() => removeItem(idx)}
                      >
                        Remove item
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </section>

          {/* Summary Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="space-y-2 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] shadow-md">
              <p className="text-lg font-medium">
                Total: ₹{total.toFixed(2)}
              </p>
              <div className="space-y-1">
                {roommates.map((r, idx) => (
                  <p 
                    key={idx} 
                    className="text-sm p-1 rounded"
                    style={{ 
                      borderLeft: `3px solid ${r.color}`,
                      paddingLeft: '8px'
                    }}
                  >
                    {r.name}: ₹{owes[idx].toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn flex-1" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy Summary"}
              </button>
              <button
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--background)] transition-colors"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
