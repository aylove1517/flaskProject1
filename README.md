Intelligent Chinese Chess System
This project implements a web-based Chinese Chess (Xiangqi) platform featuring intelligent AI gameplay, personalized user interaction, and cloud-based data storage. The system supports human vs. AI, AI vs. AI, endgame challenges, and personalized settings such as theme and background music.

Features
Human vs. AI and AI vs. AI gameplay

AI based on Minimax search with Alpha-Beta pruning and iterative deepening

Evaluation function combining piece value and positional value

Three difficulty levels with different search depths

Undo, replay, and move history recording

User login and registration system with guest mode

Leaderboard and scoring system

Support for Chinese and English language switching

Custom chess piece and board styles

Background music selection

Compatible with both PC and mobile devices

Technologies Used
Frontend: HTML5, CSS3, JavaScript (Canvas)

Backend: Python (Flask), Flask-RESTful

Database: MySQL with SQLAlchemy

Deployment-ready for both local testing and production

Project Structure
app.py: Main application logic

templates/: HTML pages

static/: CSS, JavaScript, images, audio

ai/: AI logic and evaluation functions

models.py: Database models

config.py: Configuration settings

How to Run
Install required dependencies (Flask, SQLAlchemy, etc.)

Configure your MySQL database connection

Initialize the database tables

Run the application with python app.py

Access the platform at http://127.0.0.1:5000

Future Work
Integrate reinforcement learning or self-play training

Extend to mobile platforms such as WeChat Mini Programs

Add social features such as game sharing and friend battles
