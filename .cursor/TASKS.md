# Roomie Bill Splitter – Task List

## 1. Project Setup
- [x] 1.1. Initialize a new Next.js project.
- [x] 1.2. Set up Tailwind CSS for styling.
- [x] 1.3. Configure project for Vercel deployment (add vercel.json if needed).

## 2. Basic App Structure
- [x] 2.1. Create the main page (`pages/index.tsx` or `pages/index.js`).
- [x] 2.2. Add app title and short description at the top.
- [x] 2.3. Set up a responsive container for the app content.

## 3. Roommate Management
- [x] 3.1. Display 4 roommate names at the top (default: You, Roommate 1, Roommate 2, Roommate 3).
- [x] 3.2. Make roommate names editable (input fields).
- [x] 3.3. Store roommate names in React state.

## 4. Bill Entry Form
- [x] 4.1. Create a table or list for item entry.
- [x] 4.2. For each item, allow input of:
  - [x] 4.2.1. Item name
  - [x] 4.2.2. Item price
  - [x] 4.2.3. Assignment to one or more roommates (checkboxes for each roommate + "common")
- [x] 4.3. Add button to add more items (dynamic rows).
- [x] 4.4. Store all items and assignments in React state.

## 5. Bill Calculation Logic
- [x] 5.1. Implement logic to split costs based on item assignment.
  - [x] 5.1.1. If "common", split equally among all roommates.
  - [x] 5.1.2. If assigned to specific roommates, split among them.
- [x] 5.2. Calculate and display how much each roommate owes.

## 6. Summary Generation
- [x] 6.1. Create a summary section showing:
  - [x] 6.1.1. Total bill amount
  - [x] 6.1.2. Amount owed by each roommate
  - [x] 6.1.3. Itemized details (who paid for what)
- [x] 6.2. Add a button to generate WhatsApp-formatted summary text.
- [x] 6.3. Add "Copy to Clipboard" functionality for the summary.

## 7. Reset/Clear Functionality
- [x] 7.1. Add a "Reset" button to clear all data (roommate names, items, calculations).

## 8. UI/UX Enhancements
- [ ] 8.1. Ensure mobile responsiveness (Tailwind breakpoints).
- [ ] 8.2. Polish UI for clarity and ease of use.

## 9. Deployment
- [ ] 9.1. Push code to GitHub.
- [ ] 9.2. Connect repo to Vercel and deploy.
- [ ] 9.3. Test deployed app for all core features.

## 10. Stretch Goals (Optional)
- [ ] 10.1. Add option to download/share summary as PDF.
- [ ] 10.2. Save previous bills in localStorage.
- [ ] 10.3. Implement dark mode toggle. 