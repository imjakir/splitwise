# PLAN.md

## App Name
**Roomie Bill Splitter**

## Problem Statement
Living with roommates often involves shared expenses. When one person pays for a group of items (some shared, some personal), splitting the bill fairly and transparently can be tedious. This app aims to make bill splitting simple, clear, and shareable.

## App Idea
A web app where a user can:
- Enter purchased items, their prices, and assign each item to one or more roommates (or "common").
- Instantly see how much each roommate owes.
- Generate a summary text to copy and share in a WhatsApp group.

## Core Features
1. **Add Items**: Enter item name, price, and assign to one or more people (or "common").
2. **Roommate Management**: Predefined 4 roommates (user + 3 others), with option to rename.
3. **Bill Calculation**: Automatically split costs based on item assignment (common items split equally).
4. **Summary Generation**: Generate a clear, formatted text summary for WhatsApp.
5. **Reset/Clear**: Start a new bill easily.

## Tech Stack
- **Frontend**: Next.js (React, easy Vercel deployment)
- **Styling**: Tailwind CSS (for rapid, modern UI)
- **State Management**: React hooks (no external state library needed)
- **Deployment**: Vercel (free plan)
- **No backend/database**: All data in browser memory (no login, no persistence)

## UI/UX Plan
- **Home Page**: App title, short description, and bill entry form.
- **Bill Entry Form**:
  - Table or list to add items: name, price, assign to (checkboxes for each roommate + common)
  - Button to add more items
- **Roommate Names**: Editable at the top (default: You, Roommate 1, Roommate 2, Roommate 3)
- **Summary Section**:
  - Shows how much each person owes
  - Button to generate WhatsApp message (copy to clipboard)
- **Reset Button**: Clear all data
- **Mobile Friendly**: Responsive design for easy use on phones

## Example WhatsApp Summary
```
🧾 *Roomie Bill Splitter* 🧾
Total: ₹1234

You: ₹X
Roommate 1: ₹Y
Roommate 2: ₹Z
Roommate 3: ₹W

Details:
- Milk (common): ₹40
- Chips (You): ₹20
- Soap (Roommate 1): ₹30
...
```

## Deployment Plan
- Use Vercel for instant, free deployment (connect GitHub repo, push code, auto-deploy)
- No environment variables or backend setup needed

## Stretch Goals (Optional)
- Download/share summary as PDF
- Save previous bills in localStorage
- Dark mode

---

This plan ensures a simple, fast, and user-friendly bill splitting app, perfect for roommates and easy to share on WhatsApp. 