# Online Voting System

GitHub Pages + Firebase college/project voting system.

## Setup

1. Create a Firebase project.
2. Enable **Authentication > Sign-in method > Email/Password**.
3. Create a Firestore database.
4. Register a Web App in Firebase.
5. Copy its config into `js/firebase-config.js`.
6. Publish the Firestore rules from `firestore.rules`.
7. Upload this project to GitHub.
8. GitHub: **Settings → Pages → Deploy from branch → main → /root**.
9. Open the generated GitHub Pages URL.

## Create the first Host

The registration page creates normal `voter` accounts. For the first host, after registering, open Firestore and change that user's document:

`users/<USER_UID>`

Set:

`role: "host"`

After that, the host can create elections and candidates.

## Important

This is a college/project implementation, not a certified public-election system. For real elections, use independently audited election infrastructure, stronger identity verification, privacy protections, cryptographic/audit controls, and applicable legal requirements.

## Project features

- Email/password authentication
- Host and voter roles
- Host-only election creation
- Host-only candidate creation
- Firestore persistent storage
- One vote per authenticated voter per election
- Vote records cannot be deleted/updated through these rules
- Results page
- GitHub Pages compatible
