Sanskrit Learning System Backend
This is the Flask backend for the Sanskrit Learning System, providing API endpoints for various educational games.
Setup Instructions

Clone the Repository
git clone https://github.com/rohana-2005/Sanskrit-Learning-System.git
cd Sanskrit-Learning-System


Create a Virtual Environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Dependencies
pip install -r requirements.txt


Run the Flask Application
python app.py


Access the API

The API will be available at http://localhost:5000.
Example endpoints:
GET /api/verb-game
GET /api/tense-game
GET /api/drag-drop-game
GET /api/per-num-game
GET /api/mtc-game





Connecting to React Frontend
In your React dashboard, make API calls to the endpoints above. Example:
fetch('http://localhost:5000/api/verb-game')
  .then(res => res.json())
  .then(data => console.log(data));

Directory Structure
/Sanskrit-Learning-System/
│
├── api/
│   ├── verb_game.py
│   ├── tense_game.py
│   ├── drag_drop_game.py
│   ├── per_num_game.py
│   └── mtc_game.py
├── data/
│   └── sentences.json
├── helpers/
│   ├── gen.py
│   └── declensions.py
├── app.py
├── requirements.txt
└── README.md
