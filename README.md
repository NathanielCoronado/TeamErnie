<div align="center">

# 🎄🎪 Gift Draw Carnival 2026

**Online exchange gift · ₱500 · Dinner at Vikings MOA + rides!**

[![Live site](https://img.shields.io/badge/🌐_Live_site-open-d92f45?style=for-the-badge)](https://nathanielcoronado.github.io/teamernie/)
[![Register by](https://img.shields.io/badge/Register_by-Nov_30-ffc83d?style=for-the-badge&labelColor=14123a)](https://nathanielcoronado.github.io/teamernie/#register)
[![Gift](https://img.shields.io/badge/Gift-₱500-1e9e6a?style=for-the-badge)](#how-it-works)

### 👉 **https://nathanielcoronado.github.io/teamernie/**

</div>

---

## ✨ What is this?

A festive, carnival-and-Christmas themed website for **Team Ernie's** exchange gift (bunutan). It is open to everyone, whatever you believe.

## 🎁 How it works

| Step | What happens |
|---|---|
| 1️⃣ **Register** | Enter your name, email and wishlist on the site **before the end of Nov 30**. |
| 2️⃣ **The draw** | After the deadline, names are drawn automatically among **registered people only**. Nobody draws themselves. |
| 3️⃣ **Check your email** | On **Dec 1** you get an email telling you who to give a **₱500** gift to (and their wishlist). 🤫 |
| 4️⃣ **Eat & ride** | After registering, the site shows your invitation to **Vikings Luxury Buffet, SM Mall of Asia**, followed by rides! 🎡 |

## 📜 Rules

- 🎁 Gift value is **₱500** (a little under or over is fine).
- 🤫 Keep who you drew a secret until exchange day.
- 🎀 Wrap your gift and write the recipient's name on it.
- 🕊️ Please avoid gifts tied to anyone's beliefs.

## 🗂️ Project files

| File | Purpose |
|---|---|
| `index.html` | The website (registration form, countdown, invitation, gallery) |
| `Code.gs` | Google Apps Script: saves registrations to a Sheet, runs the draw, sends emails via Gmail |
| `photos/` | Site photos (`vikings.jpg`, `moa-eye.jpg`, `mall.jpg`) |

## 🛠️ Organizer setup (about 10 minutes, free)

1. **Google Sheet:** create a new Sheet, then **Extensions → Apps Script**, and paste in `Code.gs`.
2. Edit `EVENT_DATE`, `EVENT_TIME` and `ORGANIZER_NAME` at the top of the script.
3. Run `testEmail` once and allow permissions. You should receive a test email.
4. Run `setupTrigger` once. It schedules the draw for **Dec 1, 12:10 AM (Manila)**.
5. **Deploy → New deployment → Web app** with *Execute as: Me* and *Access: Anyone*. Copy the **Web app URL**.
6. In `index.html`, paste that URL into `endpoint: ""` and set the event date and time in `CONFIG`.
7. Commit the change. GitHub Pages republishes the site in about a minute.

> 🔒 The sheet never records who drew whom, so the result stays secret even from the organizer.
> ⚠️ Until `endpoint` is filled in, the site runs in **demo mode** and saves nothing.

## 🧪 Testing

Register 3 test emails, temporarily move `DEADLINE` in `Code.gs` earlier, run `runDraw`, then delete the test rows and reset the Script Property `DRAWN`.

## 🌐 Hosting

GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.

---

<div align="center">Merry Christmas & Happy Holidays from Team Ernie 🎄🎪</div>
