# SolSplit - A Decentralized Bill Splitting Application

<div align="center">
  <img src="public/SolLogo.jpg" alt="SolSplit Logo" width="120"/>
</div>

<p align="center">
  <strong>Splitting bills with friends on Solana has never been easier.</strong>
</p>

<p align="center">
  <a href="#-about-the-project">About</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-built-with">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-team">Team</a>
</p>

---
## Meet The Team
* Name: Adaobi Ruphina
* X handle: @Phinnybelle_
* Github Username: Phinnybelle

* Name: Faithy Raymond
* X handle: @Faithy_Raymond
* Github Username: Rayeberechi

* Name: Jemimah Ekong
* X handle: @Keot_jem
* Github Username: JemimahEkon


## 🚀 About The Project

Our key innovations for this prototype include:
* **Trustless Payments**: Instead of one person collecting money, all payments are directed to a central, neutral platform wallet.
* **Seamless Web3 UX**: Users enter amounts in **USD**, and the app automatically converts to the correct **SOL** amount for payment using a live price feed.
* **Effortless Payments**: Payments are made using **Solana Pay QR codes** and clickable **Phantom Universal Links**, which can be used by any Solana wallet.

This repository contains the feature-rich frontend prototype developed for our hackathon demo.

### Built With
* **React.js**: For the user interface.
* **Tailwind CSS**: For styling and a responsive design.
* **@solana/web3.js**: For Solana address validation.
* **Recharts**: For creating dynamic spending charts.
* **axios**: For making API calls to the mock AI server.
* **qrcode.react**: For generating Solana Pay QR codes.

---

## Key Features

* **Simple Onboarding:** A familiar **username/password** registration and login system.
* **Functional Dashboard:** A central hub showing real-time balances for **"You Owe"** and **"Total Owed to SolSplit,"** plus a feed of recent transactions with "Pending" or "Completed" status.
* **Full Group Management:**
    * Create groups with custom names and categories.
    * Add or remove members from a group at any time.
    * Includes robust **Solana wallet address validation** to prevent errors and duplicates.
* **Complete Bill Splitting Flow:**
    1.  Add a bill in USD.
    2.  Split the amount using interactive sliders.
    3.  Confirm the split to view USD and calculated **SOL** amounts for each member.
* **Solana Pay Integration (Devnet):**
    * Generate unique QR codes for each person's debt.
    * Includes clickable **"Open in Wallet"** and **"Copy URL"** options using Phantom Universal Links for a seamless experience on both mobile and desktop.
* **Transaction Management:**
    * Click any past transaction to view its details.
    * Manually **"Mark as Paid"** to keep the ledger accurate for off-chain payments.
* **Insightful Statistics Page:**
    * A dynamic bar chart visualizing spending habits.
    * Toggle between **Daily, Weekly, and Monthly** views.
    * A scrollable "Full History" of all transactions.
* **Mock AI Chat:**
    * A chat interface that provides "AI" insights based on your actual transaction data.
    * Can answer questions like *"what is my highest expense?"* or *"give me a breakdown by group."*

---

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/)
* A Solana wallet that supports Devnet (e.g., [Phantom](https://phantom.app/))

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Phinnybelle/SolSplit.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SolSplit
   ```
3. Install all the necessary packages:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

Live Demo: https://solsplit-three.vercel.app

Hackathon Submission Link: https://www.hackquest.io/project/eDWkUcdb/invite?user=Faith
---

## Roadmap & Future Enhancements

* [ ] **Backend & Database:** Integrate a proper backend (e.g., Node.js/Express) with a database (e.g., MongoDB) to persist all user, group, and transaction data.
* [ ] **On-Chain Transaction Confirmation:** Automatically mark payments as "Paid" by listening for confirmed transactions on the Solana blockchain.
* [ ] **Smart Contract Integration:** Move the core logic for groups and ledgers to a Solana Program (smart contract) for full decentralization.
* [ ] **User Notifications:** Implement real-time notifications for payment requests and confirmations.

---

## Team

This project is a collaborative effort by three dedicated developers:

* **Phinnybelle:** Registration, Login, Navbar, AI Insights Pages
* **Faithy:** Dashboard, Add Group Modal, Group Details Modal, Profile Modal, Transaction Modal, Confirm Split Pages
* **Jemmy:** Add Bill, Statistics, Split Bill Pages