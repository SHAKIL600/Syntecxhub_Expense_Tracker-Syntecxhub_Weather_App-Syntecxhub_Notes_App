# Syntecxhub Web Development Task - Submission Guide

Three separate GitHub repositories (one per project), named exactly:

| Project | Repo name |
|---|---|
| Expense Tracker | `Syntecxhub_Expense_Tracker` |
| Weather App | `Syntecxhub_Weather_App` |
| Notes App | `Syntecxhub_Notes_App` |

## Run a project locally
Needs Node.js 18+ (https://nodejs.org).
```bash
cd Syntecxhub_Expense_Tracker
npm install
npm run dev      # open http://localhost:5173
```
Same steps for the other two folders. The Weather App needs an internet connection.

## Push each project to GitHub
Create an empty repo on github.com with the exact name, then:
```bash
cd Syntecxhub_Expense_Tracker
git init
git add .
git commit -m "Add expense tracker built with React hooks"
git branch -M main
git remote add origin https://github.com/<your-username>/Syntecxhub_Expense_Tracker.git
git push -u origin main
```
`node_modules` and `dist` are already ignored by `.gitignore`. Repeat for the other two folders.

## LinkedIn post (mention @Syntecxhub)
> Another milestone in my @Syntecxhub Web Development internship! 🚀
> I built three React apps: an Expense Tracker (useState, useEffect, useRef, useMemo, useCallback), a Weather App with a live forecast API and error handling, and a Notes App with localStorage persistence.
> Source code: <paste GitHub links>
> #React #WebDevelopment #JavaScript #Internship #Syntecxhub

## Final step
Submit the GitHub links through the official **Submission Form**.
